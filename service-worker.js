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
    "revision": "92973c394ddde0a48e78bab0aa44c7a0"
  },
  {
    "url": "assets/css/0.styles.24509f1b.css",
    "revision": "6c10d5255952de02f975093b28a0f232"
  },
  {
    "url": "assets/img/docker-container-actions-create.150e9baa.png",
    "revision": "150e9baa17c09b305b242615f69ff7e3"
  },
  {
    "url": "assets/img/docker-container-actions-run.61caf0ee.png",
    "revision": "61caf0ee9e531524314037af58e0076e"
  },
  {
    "url": "assets/img/docker-events.150e9baa.png",
    "revision": "150e9baa17c09b305b242615f69ff7e3"
  },
  {
    "url": "assets/img/pull-create-start.9dcf32cd.png",
    "revision": "9dcf32cd71c255248b56517675ba7f6b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.48aef8e4.js",
    "revision": "9e42d66e9bf62dd1c698efcad1204fac"
  },
  {
    "url": "assets/js/11.1c574b93.js",
    "revision": "a2771cef73715529ad15ec49defa8473"
  },
  {
    "url": "assets/js/12.2677e3f3.js",
    "revision": "4ac5cd0178bbc6edbb2c1756de1916d1"
  },
  {
    "url": "assets/js/13.ff61d7eb.js",
    "revision": "ee9c0e02a10cd8b4888c71f150d7478c"
  },
  {
    "url": "assets/js/14.0910be98.js",
    "revision": "3af3dc5b65774b0ee4b57d9319123439"
  },
  {
    "url": "assets/js/15.b3809335.js",
    "revision": "1031583fa0045bdceccabb1fc55dfa1e"
  },
  {
    "url": "assets/js/16.7501100f.js",
    "revision": "9659a49cf296e81359556d912ca09d9c"
  },
  {
    "url": "assets/js/17.b2e91ab6.js",
    "revision": "dbe9a1d9bca7adcb478fe2ebc4b0dd4a"
  },
  {
    "url": "assets/js/18.d90a2069.js",
    "revision": "a598180b3a9e0f9d5c69c9cb7bcb9585"
  },
  {
    "url": "assets/js/3.0363be99.js",
    "revision": "02f194aa8b7439de493c59ae9b07fa2f"
  },
  {
    "url": "assets/js/4.cc72a74f.js",
    "revision": "d390306519025e093f7aa1bb22fea301"
  },
  {
    "url": "assets/js/5.e6caa913.js",
    "revision": "0e997365b74a4fc6f86d4c7911930a59"
  },
  {
    "url": "assets/js/6.6e33da21.js",
    "revision": "7a57f0f879eac5097d8c2cecb336cf52"
  },
  {
    "url": "assets/js/7.1fb18dd2.js",
    "revision": "145283d0dd6cecbac6b8782905405d2d"
  },
  {
    "url": "assets/js/8.1fad56a7.js",
    "revision": "290b0bcad5da3fb71726b7b183b4fb29"
  },
  {
    "url": "assets/js/9.d9c0ccea.js",
    "revision": "63518a918eb9200892e53ca72f6ef160"
  },
  {
    "url": "assets/js/app.d3c26f98.js",
    "revision": "1b65edff4134e3d4504a7de06956395c"
  },
  {
    "url": "assets/js/vendors~flowchart.0480cffa.js",
    "revision": "b3ba6ef40184b65666ac22aa20cc4af9"
  },
  {
    "url": "config/index.html",
    "revision": "fd115a92f83ef0ae9d28c3353fdd9932"
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
    "revision": "869094ec9144843e46f1dfa866303943"
  },
  {
    "url": "guide/docker-container-actions.html",
    "revision": "149489970989eb5f0ee817637b8a40be"
  },
  {
    "url": "guide/docker-events.html",
    "revision": "32fd6d499d88ccef3e5cb7c65323b6e3"
  },
  {
    "url": "guide/docker-node-actions.html",
    "revision": "aede2325dbccbf779a874358276f19f4"
  },
  {
    "url": "guide/docker-volume-actions.html",
    "revision": "ef4dc4b18eaf19768f87f716bb511ac2"
  },
  {
    "url": "guide/examples.html",
    "revision": "e3301d820e2e5abcbe25cf37f2cdfc8d"
  },
  {
    "url": "guide/index.html",
    "revision": "6a96c754385554412222c40d11fff556"
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
    "revision": "ff7810680bca2cdd982865342b92eb16"
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
