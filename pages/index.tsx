import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import WelcomeBox from '../components/WelcomeBox'
import QuestionWrapper from '../components/QuestionWrapper'
import asyncForEach from '../plugins/asyncForEach'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const Home: NextPage<Props> = props => (
  <Layout>
    <Hero />
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-9/12 m-auto flex flex-wrapper">
        <div className="w-8/12 pr-5">
          {props.questions.map((question, index) => (
            <QuestionWrapper question={question} key={index} />
          ))}
        </div>
        <aside className="w-4/12">
          <WelcomeBox class="border border-gray-300 rounded p-3" />
        </aside>
      </div>
    </div>
  </Layout>
)

Home.getInitialProps = async () => {
  const questionData = await db
    .collection('questions')
    .orderBy('created', 'desc')
    .limit(10)
    .get()
  const questions: any = []
  await asyncForEach(questionData.docs, async doc => {
    const question = doc.data()
    const [userData, answerData] = await Promise.all([
      db
        .collection('publicUsers')
        .doc(question.fromUserId)
        .get(),
      db
        .collection('answers')
        .where('questionId', '==', question.id)
        .get()
    ])
    const user = userData.data()
    const answerCount = answerData.size
    questions.push({ question, user, answerCount })
  })
  return { questions }
}

interface Props {
  questions: any
}

export default Home
