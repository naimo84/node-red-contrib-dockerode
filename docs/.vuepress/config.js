module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'node-red-contrib-dockerode',
      description: 'Connects Node RED with Docker daemon'
    }
  },
  dest: './build',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#706B69' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: {
        '/': {
          message: "New content is available.",
          buttonText: "Refresh"
        }
      }
    },
    'vuepress-plugin-code-copy': {
      color: '#F6EEE9',
      backgroundColor: "#706B69",
    },
    'flowchart': true

  },
  theme: '@vuepress/theme-default',
  themeConfig: {
    repo: 'naimo84/node-red-contrib-dockerode.github.io',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    sidebarDepth: 3,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'Configuration',
            link: '/config/'
          }
        ],
        sidebar: {
          '/guide/': [
            // '/guide/',
            // {
            //   title: 'Installation',
            //   path: '/guide/installation',
            //   collapsable: false,
            //   children: [
            //     '/guide/installation_cli',
            //     '/guide/installation_vscode',
            //     '/guide/installation_httpbook'
            //   ]
            // },
            // {
            //   title: 'Language',
            //   collapsable: false,
            //   children: [
            //     '/guide/request',
            //     '/guide/metaData',
            //     '/guide/variables',
            //     '/guide/environments',
            //     '/guide/scripting',
            //     '/guide/comment',
            //     '/guide/hooks'
            //   ]
            // },
            // '/guide/troubleshooting',
            // {
            //   title: 'Examples',
            //   collapsable: false,
            //   path: '/guide/examples',
            //   children: [
            //     '/guide/examples_arbeitsagentur',
            //     '/guide/examples_github',
            //     '/guide/examples_grpcbin',
            //     '/guide/examples_httpbin',
            //     '/guide/examples_learnwebservices',
            //     '/guide/examples_spacex',
            //     '/guide/examples_springboot'
            //   ]
            // },
          ]
          
        }
      }
    }
  }
}