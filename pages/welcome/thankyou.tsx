import React from 'react'
import Layout from '../../components/Layout'
import Link from 'next/link'

const Thankyou = () => {
  return (
    <Layout>
      <div className="w-full md:w-9/12 lg:w-9/12 my-10 m-auto p-2">
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
            Or, browse picked up questions.
          </h3>
        </div>
      </div>
    </Layout>
  )
}

export default Thankyou
