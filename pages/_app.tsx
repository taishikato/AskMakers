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
      const title = 'AskMakers - Ask experienced makers questions'
      const url = 'https://askmakers.co/'
      const description = 'The best place to ask experienced and successful makers questions anonymously. Let\'s get together Indie Makers!'
      return (
        <Provider store={store}>
          <Head>
            <title key="title">{title}</title>
            <link key="canonical" rel="canonical" href={url} />
            <meta
              key="description"
              name="description"
              content={description}
            />
            <meta
              key="og:description"
              property="og:description"
              content={description}
            />
            <meta
              key="keywords"
              name="keywords"
              content="Indie Maker,Startup,question,social network,product hunt,creative,maker,creation"
            />
            <meta
              key="og:title"
              property="og:title"
              content={title}
            />
            <meta key="og:site_name" property="og:site_name" content={title} />
            <meta key="og:url" property="og:url" content={url} />
            <meta key="og:image" property="og:image" content={`${url}ogimage-2.png`} />
            <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
            <script key="drift" src="/drift.js"></script>
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