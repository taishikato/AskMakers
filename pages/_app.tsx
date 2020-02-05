import React from 'react'
import App from 'next/app'
import Router from 'next/router'
import Head from 'next/head'
import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import NextNprogress from 'nextjs-progressbar'
import Auth from '../components/Auth'
import withGA from 'next-ga'
import { initializeStore } from '../store/store'
import 'antd/lib/tabs/style/index.css'
import 'antd/lib/empty/style/index.css'
import 'antd/lib/upload/style/index.css'
import 'antd/lib/message/style/index.css'
import 'antd/lib/checkbox/style/index.css'
import 'antd/lib/comment/style/index.css'
import 'antd/lib/tag/style/index.css'
import 'antd/lib/spin/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/divider/style/index.css'
import 'react-mde/lib/styles/css/react-mde-all.css'
import '../css/tailwind.css'
import '../css/main.css'

const MyApp = withRedux(initializeStore)(
  class MyApp extends App<Props> {
    render() {
      const { Component, pageProps, store } = this.props
      const title = 'Vaping Astronaut | Vape Reviews'
      const url = 'https://vapingastronaut.com/'
      const description = 'Vaping Astronaut helps vape lovers explore, understand and make better-informed decisions around vape with product reviews.'
      return (
        <Provider store={store}>
          <Head>
            <title>{title}</title>
            <link key="manifest" rel='manifest' href='/manifest.json' />
            <link key="canonical" rel="canonical" href={url} />
            <meta
              key="description"
              name="description"
              content={description}
            />
            <meta
              key="keywords"
              name="keywords"
              content="vape, review, kits, mods, tanks, pods"
            />
            <meta
              key="og:titl"
              property="og:title"
              content={title}
            />
            <meta
              key="og:description"
              property="og:description"
              content={description}
            />
            <meta key="og:site_name" property="og:site_name" content={title} />
            <meta key="og:url" property="og:url" content={url} />
            <meta key="og:image" property="og:image" content={`${url}ogimage.png`} />
            <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
          </Head>
          <NextNprogress color="#23d160" />
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </Provider>
      )
    }
  }
)

interface Props {
  store: any
}

export default withGA('UA-27648393-24', Router)(MyApp)