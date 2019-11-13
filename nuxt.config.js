const title = 'AskMakers - Ask experienced makers questions anonymously'
const url = 'https://askmakers.co'
const description =
  "The best place to ask experienced and successful makers questions anonymously. Let's get together Indie Makers!"

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title,
    htmlAttrs: {
      class: 'has-navbar-fixed-top',
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: description
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'Indie Maker,Startup,question,social network,product hunt,creative,maker,creation'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: title
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: description
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: title
      },
      { hid: 'og:url', property: 'og:url', content: url },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${url}/ogimage.png`
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        hid: 'twitter:site',
        property: 'twitter:site',
        content: '@taishikat0'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'hsl(141, 71%, 48%)' },
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/bulma',
    '@/assets/css/main',
    '@fortawesome/fontawesome-free/css/fontawesome.css',
    '@fortawesome/fontawesome-free/css/solid.min.css',
    '@fortawesome/fontawesome-free/css/brands.min.css',
    '@fortawesome/fontawesome-free/css/regular.min.css',
    '@fortawesome/fontawesome-free/webfonts/fa-brands-400.svg',
    '@fortawesome/fontawesome-free/webfonts/fa-solid-900.svg',
    '@fortawesome/fontawesome-free/webfonts/fa-regular-400.svg',
    './node_modules/bulma-divider/dist/css/bulma-divider.min.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/moment',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-27648393-24'
      }
    ]
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
