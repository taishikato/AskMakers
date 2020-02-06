import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import QuestionWrapper from '../components/QuestionWrapper'
import AnswerWrapper from '../components/AnswerWrapper'
import TwitterIcon from '../components/TwitterIcon'
import ProducthuntIcon from '../components/ProducthuntIcon'
import GitHubIcon from '../components/GitHubIcon'
import PatreonIcon from '../components/PatreonIcon'
import asyncForEach from '../plugins/asyncForEach'
import { Tabs } from 'antd'
import { Empty } from 'antd'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const Username: NextPage<Props> = props => {
  const { user, questionsData, answerCount, questionUpvoteCount, answerData } = props
  const { TabPane } = Tabs
  const router = useRouter()
  const title = 'Terms of Service & Privacy | AskMakers - Ask experienced makers questions'
  const url = `https://askmakers.co${router.asPath}`

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
      <div className="bg-gray-100">
        <div className="py-8 m-auto w-9/12">
          <div className="flex flex-wrapper">
            <div>
              <img src={user.picture} width="160px" className="rounded-full" alt={user.customName} />
            </div>
            <div className="ml-5">
              <h1 className="font-bold text-4xl">
                {user.customName}
              </h1>
              <div>
                {user.tagline}
              </div>
              {user.website !== undefined && user.website !== '' &&
              <div>
                <a href={user.website} target="_blank">
                  {user.website}
                </a>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-9/12 lg:w-9/12 mt-5 m-auto p-3">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full md:w-8/12 lg:w-8/12 px-3">
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    Questions
                  </span>
                }
                key="1"
              >
                {questionsData.length === 0 &&
                  <Empty description="No question yet" />
                }
                {questionsData.length > 0 &&
                  questionsData.map((question, index) => (
                    <div key={index}>
                      <QuestionWrapper question={{ question }} />
                    </div>
                  ))
                }
              </TabPane>
              <TabPane
                tab={
                  <span>
                    Answers
                  </span>
                }
                key="2"
              >
                {answerData.length === 0 &&
                  <Empty description="No question yet" />
                }
                {answerData.length > 0 &&
                  answerData.map((answerRelatedData, index) => (
                    <div key={index}>
                      <AnswerWrapper answerData={answerRelatedData} />
                    </div>
                  ))
                }
              </TabPane>
            </Tabs>
          </div>
          <div className="w-full md:w-3/12 lg:w-3/12 px-3">
            <div className="border border-gray-300 rounded p-3">
              <h3 className="font-semibold text-xl mb-2">Social</h3>
              <div className="flex flex-wrap">
                {user.social.twitter !== undefined && user.social.twitter !== '' &&
                  <div className="w-4/12">
                    <TwitterIcon name={user.social.twitter} />
                  </div>
                }
                {user.social.productHunt !== undefined && user.social.productHunt !== '' &&
                  <div className="w-4/12">
                    <ProducthuntIcon name={user.social.productHunt} />
                  </div>
                }
                {user.social.gitHub !== undefined && user.social.gitHub !== '' &&
                  <div className="w-4/12">
                    <GitHubIcon name={user.social.gitHub} />
                  </div>
                }
                {user.social.patreon !== undefined && user.social.patreon !== '' &&
                  <div className="w-4/12">
                    <PatreonIcon name={user.social.patreon} />
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Username.getInitialProps = async ({ query }) => {
  const username = query.username
  const userData = await db
    .collection('publicUsers')
    .where('username', '==', username)
    .get()
  const user = userData.docs[0].data()
  const returnUser = {
    customName: user.customName,
    tagline: user.tagline,
    picture: user.picture,
    social: user.social,
    website: user.website,
  }

  let returnQuestion: any = []
  let answerCount = 0
  let questionUpvoteCount = 0
  const [questionData, answerData] = await Promise.all([
    db
      .collection('questions')
      .where('fromUserId', '==', user.uid)
      .where('isGeneral', '==', true)
      .orderBy('created', 'desc')
      .get(),
    db
      .collection('answers')
      .where('answerUserId', '==', user.uid)
      .orderBy('created', 'desc')
      .get()
  ])
  // Question
  if (questionData.size > 0) {
    await asyncForEach(questionData.docs, async doc => {
      const question = doc.data()
      const [asnswerData, upvoteData] = await Promise.all([
        db.collection('answers').where('questionId', '==', question.id).get(),
        db.collection('upvotes').where('questionId', '==', question.id).get()
      ])
      returnQuestion.push({
        text: question.text,
        slug: question.slug,
        created: question.created,
        answerCount: asnswerData.size,
        questionUpvoteCount: upvoteData.size
      })
    })
  }
  // Answer
  let returnAnswerData: any = []
  if (answerData.size > 0) {
    await asyncForEach(answerData.docs, async doc => {
      const answer = doc.data()
      const [questionData, upvoteData] = await Promise.all([
        db
          .collection('questions')
          .where('id', '==', answer.questionId)
          .get(),
        db
          .collection('upvotes')
          .where('answerId', '==', answer.id)
          .get(),
      ])
      const question = questionData.docs[0].data()
      returnAnswerData.push({
        answerContent: answer.content,
        answerId: answer.id,
        answerUpvoteCount: upvoteData.size,
        questionSlug: question.slug,
        questionText: question.text,
      })
    })
  }
  return {
    user: returnUser,
    questionsData: returnQuestion,
    answerData: returnAnswerData,
    answerCount,
    questionUpvoteCount
  }
}

interface Props {
  user: any
  questionsData: any
  answerCount: number
  questionUpvoteCount: number
  answerData: any
}

export default Username
