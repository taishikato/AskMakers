import React from 'react';
import { AppProps } from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';
import Auth from '../components/Auth';
import withGA from 'next-ga';
import { wrapper } from '../store/store';
import 'antd/lib/upload/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/checkbox/style/index.css';
import 'antd/lib/tag/style/index.css';
import 'antd/lib/spin/style/index.css';
import 'antd/lib/tooltip/style/index.css';
import 'antd/lib/divider/style/index.css';
import 'antd/lib/skeleton/style/index.css';
import 'react-mde/lib/styles/css/react-mde-all.css';
import '../css/tailwind.css';
import '../css/main.css';

const WrappedApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const title = 'AskMakers - Ask experienced makers questions';
  const url = 'https://askmakers.co/';
  const description =
    "The best place to ask experienced and successful makers questions. Let's get together Indie Makers!";
  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <link key="canonical" rel="canonical" href={url} />
        <meta key="description" name="description" content={description} />
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
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <meta
          key="og:image"
          property="og:image"
          content={`${url}ogimage-2.png`}
        />
        <meta
          key="twitter:card"
          property="twitter:card"
          content="summary_large_image"
        />
      </Head>
      <NextNprogress color="#23d160" />
      <Auth>
        <Component {...pageProps} />
      </Auth>
    </>
  );
};

export default withGA('UA-27648393-24', Router)(wrapper.withRedux(WrappedApp));
