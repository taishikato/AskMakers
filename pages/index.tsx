import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import FeaturedMaker from '../components/FeaturedMaker'
import WelcomeBox from '../components/WelcomeBox'
import QuestionWrapper from '../components/QuestionWrapper'
import asyncForEach from '../plugins/asyncForEach'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const Home: NextPage<Props> = props => (
  <Layout>
    <Hero />
    <div className="mb-10">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full px-3 md:w-9/12 lg:w-9/12 m-auto flex flex-wrap">
        <div className="w-full md:w-8/12 lg:w-8/12 md:pr-5 lg:pr-5">
          {props.questions.map((question, index) => (
            <QuestionWrapper question={question} key={index} />
          ))}
        </div>
        <aside className="w-full md:w-4/12 lg:w-4/12">
          <WelcomeBox class="border border-gray-300 rounded p-3 mb-5" />
          <FeaturedMaker class="border border-gray-300 rounded p-3" />
        </aside>
      </div>
    </div>
  </Layout>
)

Home.getInitialProps = async () => {
  const questionData = await db
    .collection('questions')
    .where('isGeneral', '==', true)
    .orderBy('created', 'desc')
    .limit(10)
    .get()
  const questions: any = []
  await asyncForEach(questionData.docs, async doc => {
    const question = doc.data()
    const [userData, answerData, upvoteData] = await Promise.all([
      db
        .collection('publicUsers')
        .doc(question.fromUserId)
        .get(),
      db
        .collection('answers')
        .where('questionId', '==', question.id)
        .get(),
      db
        .collection('questionUpvotes')
        .where('questionId', '==', question.id)
        .get()
    ])
    const user = userData.data()
    question.answerCount = answerData.size
    question.questionUpvoteCount = upvoteData.size
    questions.push({ question, user })
  })
  return { questions }
}

interface Props {
  questions: any
}

export default Home
