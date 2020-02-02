import React from 'react'
import { NextPage } from 'next'
import Layout from '../components/Layout'
import QuestionWrapper from '../components/QuestionWrapper'
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
                      <QuestionWrapper question={{ question, answerCount, upvoteCount }} />
                    </div>
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
          <div className="w-full md:w-3/12 lg:w-3/12 px-3">
            <div className="border border-gray-300 rounded p-3">
              <h3 className="font-semibold text-xl mb-2">Social</h3>
              <div className="flex flex-wrap">
                {user.social.twitter !== undefined &&
                  <div className="w-4/12">
                    <TwitterIcon name={user.social.twitter} />
                  </div>
                }
                {user.social.productHunt !== undefined &&
                  <div className="w-4/12">
                    <ProducthuntIcon name={user.social.productHunt} />
                  </div>
                }
                {user.social.gitHub !== undefined &&
                  <div className="w-4/12">
                    <GitHubIcon name={user.social.gitHub} />
                  </div>
                }
                {user.social.patreon !== undefined &&
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
