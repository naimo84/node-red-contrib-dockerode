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
    "revision": "9646f405fb7bc842e5ffefd13352e22b"
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
    "url": "assets/js/10.e6f931c1.js",
    "revision": "d2afe3c6a76238900d88d7fa3729daea"
  },
  {
    "url": "assets/js/11.f189dcc8.js",
    "revision": "a340d7299a2c4df0cbac4b23a5b2f82d"
  },
  {
    "url": "assets/js/12.3b102da7.js",
    "revision": "0f3516a896a8d5fb641793b741dc7fde"
  },
  {
    "url": "assets/js/13.1d253d4b.js",
    "revision": "e2b57bd9abcfafb2c4d9c04dcdb29c98"
  },
  {
    "url": "assets/js/14.5d02cc78.js",
    "revision": "fc58769f6e5af91d618f9fe559d6c2f6"
  },
  {
    "url": "assets/js/3.39eefdf0.js",
    "revision": "34057612e0e528ccc9e38b3ff7c9dcbd"
  },
  {
    "url": "assets/js/4.da0a0ad7.js",
    "revision": "6dcc8b880a5e8997677bccefce23f199"
  },
  {
    "url": "assets/js/5.b9258916.js",
    "revision": "2d8e6be4fca99649df59fecf1f7d152b"
  },
  {
    "url": "assets/js/6.b50e9ddd.js",
    "revision": "71aa34bd10aad4cd94f968c712a303a9"
  },
  {
    "url": "assets/js/7.490d4595.js",
    "revision": "5de6252ec65241b20b08ebc241a50e20"
  },
  {
    "url": "assets/js/8.c02b99ae.js",
    "revision": "bd0b5f523755a80638b8c5a4533bb061"
  },
  {
    "url": "assets/js/9.455a70d7.js",
    "revision": "68afae9ecdc58d0a6dd0e39605b27d7c"
  },
  {
    "url": "assets/js/app.9495d070.js",
    "revision": "c94555c52624d725ab03c5181d1671d1"
  },
  {
    "url": "assets/js/vendors~flowchart.db8e65b8.js",
    "revision": "d6704e1487d008958a6f0ecb74c214ed"
  },
  {
    "url": "config/index.html",
    "revision": "b6de859462e289cae197423370c21bf0"
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
    "revision": "2c2f51c0c737a2f9ac40ac0cba9bfa55"
  },
  {
    "url": "guide/docker-container-actions.html",
    "revision": "84ae7f4cbaf544c426373edbfd21b1f8"
  },
  {
    "url": "guide/index.html",
    "revision": "0307efbeaefbbfe6607cb53af223d52e"
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
    "revision": "6e0a727a44eaa514bc0dce732b7f6bea"
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
