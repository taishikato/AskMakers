import React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import WelcomeBox from '../components/WelcomeBox'
import QuestionWrapper from '../components/QuestionWrapper'

const Home = () => (
  <Layout>
    <Hero />
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-9/12 m-auto flex flex-wrapper">
        <div className="w-8/12 pr-5">
          <QuestionWrapper />
          <QuestionWrapper />
        </div>
        <aside className="w-4/12">
          <WelcomeBox class="border border-gray-300 rounded p-3" />
        </aside>
      </div>
    </div>
  </Layout>
)

export default Home
