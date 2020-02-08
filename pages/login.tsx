import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import TwitterLoginButton from '../components/TwitterLoginButton'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'
import firebase from '../plugins/firebase'
const twitterProvider = new firebase.auth.TwitterAuthProvider()

const handleSignIn = () => {
  firebase.auth().signInWithRedirect(twitterProvider)
}

const Login = () => {
  const router = useRouter()
  const title = 'Login and SignUp | AskMakers - Ask experienced makers questions'
  const url = `https://askmakers.co${router.asPath}`
  const isCheckingLogin = useSelector(state => state.isCheckingLogin)
  return (
    <Layout>
      <Head>
      <title key="title">{title}</title>
      <meta
        key="og:title"
        property="og:title"
        content={title}
      />
      <meta key="og:site_name" property="og:site_name" content={title} />
      <meta key="og:url" property="og:url" content={url} />
      <link key="canonical" rel="canonical" href={url} />
      </Head>
      <div className="text-center mt-20">
        <Spin spinning={isCheckingLogin} size="large">
          <h1 className="font-bold text-4xl mb-6">
            Login to AskMakers
          </h1>
          <p className="mb-5">
            Join a community of experienced makers and share your knowledge, discover the way to grow your product.
          </p>
          <div className="w-full w-3/12 m-auto">
            <TwitterLoginButton handleLogin={handleSignIn} />
          </div>
        </Spin>
      </div>
    </Layout>
  )
}

export default Login
