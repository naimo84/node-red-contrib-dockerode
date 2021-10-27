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
    "revision": "25cca4aa3feac8ae5f0d531c099a89a3"
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
    "url": "assets/img/docker-events.150e9baa.png",
    "revision": "150e9baa17c09b305b242615f69ff7e3"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.aefaabb6.js",
    "revision": "9565925777b664caa891b9cbdc5c813e"
  },
  {
    "url": "assets/js/11.20eb88ef.js",
    "revision": "1cd026982bfabceee98821f15ab39677"
  },
  {
    "url": "assets/js/12.6272ccf9.js",
    "revision": "48ba35cc79555fbd04941836bd7dfdc6"
  },
  {
    "url": "assets/js/13.71f171db.js",
    "revision": "562c0e6a4e2085f980e1b58d358cbaea"
  },
  {
    "url": "assets/js/14.554b7b8e.js",
    "revision": "65eee4d8f068d7d586b2144d9d1548ad"
  },
  {
    "url": "assets/js/15.d9ddcc97.js",
    "revision": "cc2cdeb26679a3241bb336735b537317"
  },
  {
    "url": "assets/js/16.eb1cb299.js",
    "revision": "3c2fa629005e0c66141faa11c0fd63e3"
  },
  {
    "url": "assets/js/3.a681311e.js",
    "revision": "9b0b9cd83e438f66ecaac898641b09d2"
  },
  {
    "url": "assets/js/4.44163254.js",
    "revision": "17e16b747893be48bf45e44c8a190b24"
  },
  {
    "url": "assets/js/5.7c8b3cf9.js",
    "revision": "4ded1f7e22c5c02cf50107d5b2e432f4"
  },
  {
    "url": "assets/js/6.209c4215.js",
    "revision": "51c652ee6e0347b6ffdac9727cf7f151"
  },
  {
    "url": "assets/js/7.4495dce7.js",
    "revision": "3f7f5cec10fed881881f0d59943d75c8"
  },
  {
    "url": "assets/js/8.68631313.js",
    "revision": "5fb31216e83184ade5b43842ce45fb22"
  },
  {
    "url": "assets/js/9.7fc5d665.js",
    "revision": "37ab0bea061f515d62cb1c653fe1ad2f"
  },
  {
    "url": "assets/js/app.c2cdfc08.js",
    "revision": "2f97a48a9de4a98f40e1fb34c562480d"
  },
  {
    "url": "assets/js/vendors~flowchart.88b6c7aa.js",
    "revision": "6ec9428eb169bb0b962842f81cc7a3f7"
  },
  {
    "url": "config/index.html",
    "revision": "97e4456bb52e4b7c92b49e290037ab24"
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
    "revision": "ed7eca732bb2a2e7a9d9827ff9bf9539"
  },
  {
    "url": "guide/docker-container-actions.html",
    "revision": "ac361cfb66cb0c90d1fe133aba214aa9"
  },
  {
    "url": "guide/docker-events.html",
    "revision": "2efd8a9e0cdeaf96b0ff94c0c8e42f69"
  },
  {
    "url": "guide/docker-node-actions.html",
    "revision": "d0492a53b563f7f1d49648e6e4d62a60"
  },
  {
    "url": "guide/index.html",
    "revision": "d21e98cad44ab84721bdf32eedc041a2"
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
    "revision": "31addf327dcb4159885f036915027d96"
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
