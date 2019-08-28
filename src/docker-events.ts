import { Red, Node } from 'node-red';
import { DockerConfig } from './docker-config';

export interface DockerEvent {
    Type?: string,
    Action?: string,
    time?: string,
    timeNano?: string
}

module.exports = function (RED: Red) {
    'use strict';

    function DockerEvents(n) {
        RED.nodes.createNode(this, n);

        let config = (RED.nodes.getNode(n.config) as unknown as DockerConfig);
        let client = config.getClient();

        client.getEvents({}, (err, events) => {
            if (err) {
                this.error('Error during client.getEvents()', err);
                this.status({ fill: 'red', shape: 'ring', text: 'error' });
                return;
            }
            this.status({ fill: 'green', shape: 'dot', text: 'node-red:common.status.connected' });

            events.on('data', (data) => {
                let event: DockerEvent = {};
                try {
                    event = JSON.parse(data.toString());
                } catch (e) {
                    this.error('Error parsing JSON', e);
                    return
                }

                this.send({
                    _msgid: RED.util.generateId(),
                    type: event.Type,
                    action: event.Action,
                    time: event.time,
                    timeNano: event.timeNano,
                    payload: event
                });
            });

            events.on('close', () => {
                this.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                this.warn('Docker event stream closed.');
            });
            events.on('error', (err) => {
                this.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.disconnected' });
                this.error('Error:', err);
            });
            events.on('end', () => {
                this.status({ fill: 'yellow', shape: 'ring', text: 'stream ended' });
                this.warn('Docker event stream ended.');
            });
        })
    }

    RED.nodes.registerType('docker-events', DockerEvents);
}

