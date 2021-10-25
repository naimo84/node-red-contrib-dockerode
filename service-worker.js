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
    "revision": "b3feb0428d07a1a4edd1f86a2f77cbe6"
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
    "url": "assets/js/12.1c133944.js",
    "revision": "1b670ff78eeab18516824e3a78e489ff"
  },
  {
    "url": "assets/js/13.88fbe45b.js",
    "revision": "e1e7b2faea057a7242dd2045fd1d3245"
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
    "url": "assets/js/5.8c6315a1.js",
    "revision": "5760092d71fba8a91f1a03f2e5733ae0"
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
    "url": "assets/js/8.c08b107d.js",
    "revision": "6314f9d608ad94118dcafc1914dafb40"
  },
  {
    "url": "assets/js/9.455a70d7.js",
    "revision": "68afae9ecdc58d0a6dd0e39605b27d7c"
  },
  {
    "url": "assets/js/app.0e842bb4.js",
    "revision": "bc1ed689a376a0184814a0c175936a6a"
  },
  {
    "url": "assets/js/vendors~flowchart.db8e65b8.js",
    "revision": "d6704e1487d008958a6f0ecb74c214ed"
  },
  {
    "url": "config/index.html",
    "revision": "df95dc4f0480c95a80cab11fd217dcb9"
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
    "url": "guide/docker-container-actions.html",
    "revision": "cb877a9c6f424365c8dced491ec7f79a"
  },
  {
    "url": "guide/index.html",
    "revision": "cddbe993b3d1fddecf4af8e90eabb14f"
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
    "revision": "9a1a73ce6c87085d678071cc66eeda5c"
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
