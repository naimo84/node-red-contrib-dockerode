import { Red } from 'node-red';
import { DockerConfiguration } from './docker-configuration';

export interface DockerEvent {
    Type?: string,
    Action?: string,
    time?: string,
    timeNano?: string
}

module.exports = function (RED: Red) {

    function DockerEvents(n: any) {
        let node: any = this as any;
        RED.nodes.createNode(node, n);

        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfiguration);
        let client = config.getClient();
        let globalEvents = null;

        node.on('input', async (msg, send, done) => {
            try {
                if(globalEvents !== null){
                    globalEvents.removeAllListeners();
                    globalEvents.destroy();
                }

                const events: NodeJS.ReadableStream = await client.getEvents()
                globalEvents = events;
                node.status({ fill: 'green', shape: 'dot', text: 'node-red:common.status.connected' });

                events.on('data', (data) => {
                    let event: DockerEvent = {};
                    try {
                        event = JSON.parse(data.toString());
                    } catch (e) {
                        node.error('Error parsing JSON', msg);
                        return
                    }

                    send({
                        _msgid: RED.util.generateId(),
                        type: event.Type,
                        action: event.Action,
                        time: event.time,
                        timeNano: event.timeNano,
                        payload: event
                    });
                    done();
                });

                events.on('close', () => {
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                    node.warn('Docker event stream closed.');
                    send([null, {
                        _msgid: RED.util.generateId(),
                        type: 'dockerode',
                        payload: {
                            connected: false
                        }
                    }])
                    done();
                });
                events.on('error', (err) => {
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                    send([null, {
                        _msgid: RED.util.generateId(),
                        type: 'dockerode',
                        payload: {
                            connected: false
                        }
                    }])
                    done('Error:', err);
                });
                events.on('end', () => {
                    node.status({ fill: 'yellow', shape: 'ring', text: 'stream ended' });
                    node.warn('Docker event stream ended.');
                    done();
                });
            }
            catch {
                console.error('Failed to attach docker event listener.');
                send([null, {
                    _msgid: RED.util.generateId(),
                    type: 'dockerode',
                    payload: {
                        connected: false
                    }
                }])
                done();
            }
        })
        node.emit("input", {});
    }

    RED.nodes.registerType('docker-events', DockerEvents);
}
