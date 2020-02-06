import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import PickedUpAnswer from '../../components/PickedUpAnswer'

const Thankyou = () => {
  const router = useRouter()
  const title = 'Welcome | AskMakers - Ask experienced makers questions'
  const url = `https://askmakers.co${router.asPath}`
  return (
    <Layout>
      <Head>
        <meta key="robots" name="robots" content="noindex" />
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
      <div className="w-full md:w-8/12 lg:w-8/12 my-10 m-auto p-2">
        <h1 className="text-3xl font-bold mb-4">
          Thank you for completing your profile!
        </h1>
        <div className="mb-6">
          <h3 className="text-xl font-base mb-4">
            Now it's time to ask a question!
          </h3>
          <Link href="/ask-question">
            <a className="px-6 py-3 bg-green-400 rounded text-white font-semibold">
              Ask a Question!
            </a>
          </Link>
        </div>
        <div>
          <h3 className="text-xl font-base mb-2">
            Or, browse picked up answers!
          </h3>
          <PickedUpAnswer />
        </div>
      </div>
    </Layout>
  )
}

export default Thankyou
