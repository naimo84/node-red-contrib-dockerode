/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "dd7e5395fbfc872f62b94b95e1831820"
  },
  {
    "url": "assets/css/0.styles.24509f1b.css",
    "revision": "6c10d5255952de02f975093b28a0f232"
  },
  {
    "url": "assets/img/docker-container-actions-run.61caf0ee.png",
    "revision": "61caf0ee9e531524314037af58e0076e"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.81c6ecca.js",
    "revision": "8262992403fea9872dde062f7cbad7c3"
  },
  {
    "url": "assets/js/11.0b031aaf.js",
    "revision": "9ea8ec89773be4b63ffd3072c0cbef17"
  },
  {
    "url": "assets/js/12.3b4ba68b.js",
    "revision": "dca2d43307c7277d5a3096f629f08df1"
  },
  {
    "url": "assets/js/13.480cc630.js",
    "revision": "b92f7f281e0fc7474c06b07c28e6bfba"
  },
  {
    "url": "assets/js/14.2129c1a2.js",
    "revision": "d7a96318b6637981f8bf6541dc5d58d6"
  },
  {
    "url": "assets/js/15.365d4def.js",
    "revision": "fb2a2bb9d2d5ed0439bdbf42686fd9ea"
  },
  {
    "url": "assets/js/3.5787085b.js",
    "revision": "9b41819f6fb962d77f15d605e670540d"
  },
  {
    "url": "assets/js/4.c1cea7ba.js",
    "revision": "4c0762cd041468dda545259a05007b58"
  },
  {
    "url": "assets/js/5.ded37f9b.js",
    "revision": "113283dfa745163898b5f6e107030cf9"
  },
  {
    "url": "assets/js/6.de883dc2.js",
    "revision": "2c59a637c1a69b00f1f8d4ef272dee8a"
  },
  {
    "url": "assets/js/7.4af94d5c.js",
    "revision": "4f8dd3444bc54246778e27c5aefcb9a5"
  },
  {
    "url": "assets/js/8.54773779.js",
    "revision": "d447c9bf95202a6ac4180bfa96fdb577"
  },
  {
    "url": "assets/js/9.2ec4c605.js",
    "revision": "9bf005cf91f155715439b015940d56cd"
  },
  {
    "url": "assets/js/app.b3349a99.js",
    "revision": "0fd9166a4ab28dc78d32cbcec9de162a"
  },
  {
    "url": "assets/js/vendors~flowchart.171a5f9d.js",
    "revision": "d9b3cb775629e82832f6385731be1111"
  },
  {
    "url": "config/index.html",
    "revision": "a7b7368c194dc377cd15f5d6569de8c7"
  },
  {
    "url": "favicon.png",
    "revision": "dbafefc78b0fa3e3420f44341c6d684a"
  },
  {
    "url": "github.svg",
    "revision": "5a14e36c8b0b5e4ba427f47fca304477"
  },
  {
    "url": "guide/debug.html",
    "revision": "9c21989ee9db1f0998db7cd13ba17858"
  },
  {
    "url": "guide/docker-container-actions.html",
    "revision": "81255219640e2999d3e65fbcf78ced1b"
  },
  {
    "url": "guide/docker-node-actions.html",
    "revision": "5715ae908c8c039776adfffe7ff349df"
  },
  {
    "url": "guide/index.html",
    "revision": "4ad1a4eff789e320b53431d879cf2b71"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "2f06312e66085b0438f98d26c9ff4559"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "61194e44e10f8253a6a566a59b289942"
  },
  {
    "url": "icons/apple-touch-icon-120x120.png",
    "revision": "7c4715b46372da75f56b95f82f00fa48"
  },
  {
    "url": "icons/apple-touch-icon-152x152.png",
    "revision": "456b26b1c294c4e747e0ce349276305d"
  },
  {
    "url": "icons/apple-touch-icon-180x180.png",
    "revision": "69b2bd22da4d7aaf608b19bdd61edda9"
  },
  {
    "url": "icons/apple-touch-icon-60x60.png",
    "revision": "049be5c37837de26c423f3e2817b8c12"
  },
  {
    "url": "icons/apple-touch-icon-76x76.png",
    "revision": "99ec37bf358b850ae35d0e6bf7fe0c87"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "69b2bd22da4d7aaf608b19bdd61edda9"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "696353e994d15176727fc59b0c35b04d"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "62d92912da9e62b14291cc2f8b66a24e"
  },
  {
    "url": "icons/msapplication-icon-144x144.png",
    "revision": "f3bbc5f5cfae6394ccda295517188c82"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "fee39f2f9fe5da5247daa080ca99423d"
  },
  {
    "url": "index.html",
    "revision": "79cdac8aafba6e4a733d08c17fcb650f"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
