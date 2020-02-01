import React from 'react'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import QuestionWrapper from '../components/QuestionWrapper'
import asyncForEach from '../plugins/asyncForEach'
import { Tabs, Icon } from 'antd'
import { Empty } from 'antd'
import 'antd/lib/tabs/style/index.css'
import 'antd/lib/empty/style/index.css'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const Username: NextPage<Props> = props => {
  const { user, questionsData, answerCount, upvoteCount } = props
  const { TabPane } = Tabs

  return (
    <Layout>
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
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-8/12 lg:w-8/12 mt-5 m-auto p-3">
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
              questionsData.map(question => (
                <QuestionWrapper question={{ question, answerCount, upvoteCount }} />
              ))
            }
          </TabPane>
          {/* <TabPane
            tab={
              <span>
                Answers
              </span>
            }
            key="2"
          >
            Tab 2
          </TabPane> */}
        </Tabs>
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
  }

  let returnQuestion: any = []
  let answerCount = 0
  let upvoteCount = 0
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
        created: question.created
      })
      answerCount = asnswerData.size
      upvoteCount = upvoteData.size
    })
  }
  // Answer
  // let returnAnswer: any = []
  // if (answerData.size > 0) {
  //   await asyncForEach(answerData.docs, async doc => {
  //     const answer = doc.data()
  //     returnAnswer.push({
  //       content: answer.content,

  //     })
  //     console.log({answer})
  //   })
  // }
  return {
    user: returnUser,
    questionsData: returnQuestion,
    // answerData: returnAnswer,
    answerCount,
    upvoteCount
  }
}

interface Props {
  user: any,
  questionsData: any,
  answerCount: number,
  upvoteCount: number
}

export default Username
