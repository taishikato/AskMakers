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
      const description = 'The best place to ask experienced and successful makers questions. Let\'s get together Indie Makers!'
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
            {/* <script dangerouslySetInnerHTML={{ __html: `
              var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
              analytics.load("HfZeeTPy6twiZqv4c1I7Rp9vwpVUixch");
              analytics.page();}
            `}} /> */}
          </Head>
          <NextNprogress color="#23d160" />
          <Auth>
            <Component {...pageProps} />
          </Auth>
          {/* <Drift appId="gddhzz5hzvkm" /> */}
        </Provider>
      )
    }
  }
)

interface Props {
  store: any
}

export default withGA('UA-27648393-24', Router)(MyApp)