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
    "revision": "a58cfe2ba18c9e561eefb71ca59bf3b2"
  },
  {
    "url": "assets/css/0.styles.24509f1b.css",
    "revision": "6c10d5255952de02f975093b28a0f232"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.c2f5454e.js",
    "revision": "036fdf0d38a35256177d755c5d1d3a95"
  },
  {
    "url": "assets/js/11.09a732cd.js",
    "revision": "a33eeacfc33376ac48b14bfa28e17920"
  },
  {
    "url": "assets/js/12.74008f2b.js",
    "revision": "8c8c17b5f80cf110a1bd85ce8ff0225b"
  },
  {
    "url": "assets/js/3.4dab887d.js",
    "revision": "27b2d20117df2c05158c58f8e8bb4021"
  },
  {
    "url": "assets/js/4.305840cb.js",
    "revision": "4f9e42d05586d08786e83942127f249e"
  },
  {
    "url": "assets/js/5.d055cc6c.js",
    "revision": "1ce9763e64016f5d77bcb5c6f7edc710"
  },
  {
    "url": "assets/js/6.51181fc4.js",
    "revision": "fc8566df9bf14ba7edcc29b789c096ad"
  },
  {
    "url": "assets/js/7.313456ac.js",
    "revision": "2d25064ea05e8d65869a742911c2243c"
  },
  {
    "url": "assets/js/8.583c1358.js",
    "revision": "220c7c71bbf415b1c5147c59344c2870"
  },
  {
    "url": "assets/js/9.9329b591.js",
    "revision": "f09bd5733b6302c2c68ad90e40097510"
  },
  {
    "url": "assets/js/app.c2ebe007.js",
    "revision": "c743379cc029a8de9aabe824155c0a89"
  },
  {
    "url": "assets/js/vendors~flowchart.9a672344.js",
    "revision": "c4fc00e394f448fb76ad1a676dbe7dec"
  },
  {
    "url": "config/index.html",
    "revision": "c448f4c01cf99f0a1dc48ee37a2e281a"
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
    "url": "guide/index.html",
    "revision": "4d05d56c906e5e6b682e46844e95dfa2"
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
    "revision": "5825579e1bd4c12ac342ff03ac69c9b4"
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
