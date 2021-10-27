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
    "revision": "bfb6145af14a793609b76c320c45fc2f"
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
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.074ecad1.js",
    "revision": "ed75b93045214030d828ae0fbb5e2048"
  },
  {
    "url": "assets/js/11.2e9236dc.js",
    "revision": "2bb27b76f426e532b4e62fcbc7b354b6"
  },
  {
    "url": "assets/js/12.65f23b70.js",
    "revision": "ee988a7dd829fa475cff4c69d29031ed"
  },
  {
    "url": "assets/js/13.389b8758.js",
    "revision": "1941d155c35af333c8004a5238b3efa4"
  },
  {
    "url": "assets/js/14.fe9d128a.js",
    "revision": "7c02e172f2ead2bcf8fe87e2a5a67c32"
  },
  {
    "url": "assets/js/15.d1556e72.js",
    "revision": "007c40149c2500b20d9d9bdbf7e9a682"
  },
  {
    "url": "assets/js/16.e2fd0cde.js",
    "revision": "0c4fa4d3f6e168d48cc57d9ef467d2c9"
  },
  {
    "url": "assets/js/3.a568dbce.js",
    "revision": "a52b0be7664395a4ae407ade831d2049"
  },
  {
    "url": "assets/js/4.bff48fa9.js",
    "revision": "429ae5bb66d3f33870abe556e4d07ddc"
  },
  {
    "url": "assets/js/5.72382941.js",
    "revision": "e0325bc73c262fc5ee26077bff8b7993"
  },
  {
    "url": "assets/js/6.acd9bf5f.js",
    "revision": "dbb63f398f01ef73f814dfeae1807bdc"
  },
  {
    "url": "assets/js/7.2dabd562.js",
    "revision": "9954f3ce27cec0907174bab48c9a78ac"
  },
  {
    "url": "assets/js/8.734ed2b9.js",
    "revision": "5b1721fac375b3a09d4fa08bc723d248"
  },
  {
    "url": "assets/js/9.6e339f2a.js",
    "revision": "e2bc35b52d1860a95cf14cb9a3695cb1"
  },
  {
    "url": "assets/js/app.b308666c.js",
    "revision": "a6f98943c00595e36364455ccfd29757"
  },
  {
    "url": "assets/js/vendors~flowchart.91797c65.js",
    "revision": "edb28c08c64ec80f50b98f32a26fdf49"
  },
  {
    "url": "config/index.html",
    "revision": "b76e764f5e248bfb43ea5ad2fa66c679"
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
    "revision": "e522a1346837c90a8b2f166ea6f668f2"
  },
  {
    "url": "guide/docker-container-actions.html",
    "revision": "c4734ad15df127b074bf590144cd5482"
  },
  {
    "url": "guide/docker-events.html",
    "revision": "324fa239cf0f47ce3ae86dfe66e3ef9a"
  },
  {
    "url": "guide/docker-node-actions.html",
    "revision": "be79a5a1ebab8c279145d7b72f27a4db"
  },
  {
    "url": "guide/index.html",
    "revision": "f82876bf84b7eaffd15e3316902f457f"
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
    "revision": "e25622c872dde49beef972c0ff110cb5"
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
