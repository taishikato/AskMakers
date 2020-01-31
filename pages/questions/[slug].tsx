import React from 'react'
import Layout from '../../components/Layout'
import { Divider } from 'antd'
import 'antd/lib/divider/style/index.css'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import moment from 'moment'
import asyncForEach from '../../plugins/asyncForEach'
import getUnixTime from '../../plugins/getUnixTime'
import { useDispatch, useSelector } from "react-redux";
import uuid from 'uuid/v4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleUp as faArrowAltCircleUped } from '@fortawesome/free-solid-svg-icons'
import { Comment, Tooltip, Avatar } from 'antd'
import 'antd/lib/avatar/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/comment/style/index.css'
import ReactMarkdown from 'react-markdown'
import firebase from '../../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
})

const QuestionsSlug = props => {
  const [answerValue, setAnswerValue] = React.useState('')
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write")
  const [isPosting, setIsPosting] = React.useState(false)
  const [upvoteAnswers, setUpvoteAnswers] = React.useState(0)
  const [isQuestionUpvoted, setIsQuestionUpvoted] = React.useState(false)
  const { question, answers } = props
  const loginUser = useSelector(state => state.loginUser)
  // const [loginUserData, setLoginUserData] = React.useState(loginUser)

  React.useEffect(() => {
    const checkUpvoted = async () => {
      console.log({loginUser})
      console.log({question})
      const questionUpvoteData = await db
        .collection('questionUpvotes')
        .where('userId', '==', loginUser.uid)
        .where('questionId', '==', question.id)
        .get()
      console.log({questionUpvoteData})
      if (questionUpvoteData.size === 0) {
        return
      }
      setIsQuestionUpvoted(true)
    }
    if (Object.keys(loginUser).length > 0) { 
      checkUpvoted()
    }
  }, [loginUser])

  const handleUpvoteQuestion = async () => {
    const id = uuid().split('-').join('')
    await db
      .collection('questionUpvotes')
      .doc(id)
      .set({
        id,
        userId: loginUser.uid,
        questionId: question.id,
        created: getUnixTime(),
      })
    setIsQuestionUpvoted(true)
  }

  const handleUnUpvoteQuestion = async () => {
    console.log('handleUpvoteQuestion')
    const upvoteData = await db
      .collection('questionUpvotes')
      .where('userId', '==', loginUser.uid)
      .where('questionId', '==', question.id)
      .get()
    await db
      .collection('questionUpvotes')
      .doc(upvoteData.docs[0].id)
      .delete()
    setIsQuestionUpvoted(false)
  }

  const handlePostAnswer = async () => {
    setIsPosting(true)
    const id = uuid.split('-').join()
    await db
      .collection('answers')
      .doc(id)
      .set({})
    setIsPosting(false)
  }

  const actions = [
    <span key="comment-basic-like" className="flex flex-wrapper items-center">
      <Tooltip title="Upvote">
        <button>
          <FontAwesomeIcon icon={faArrowAltCircleUp} size="xs" className="h-4 w-4" />
        </button>
      </Tooltip>
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{upvoteAnswers}</span>
    </span>,
  ]

  return (
    <Layout>
      <div className="w-7/12 mt-8 m-auto p-3">
        <div>
          <div className="flex flex-wrapper items-center mb-3">
            {!isQuestionUpvoted ?
              <Tooltip title="Upvote">
                <button onClick={handleUpvoteQuestion} className="focus:outline-none">
                  <FontAwesomeIcon icon={faArrowAltCircleUp} size="xs" className="h-6 w-6" />
                </button>
              </Tooltip> :
              <Tooltip title="Upvoted">
                <button onClick={handleUnUpvoteQuestion} className="focus:outline-none">
                  <FontAwesomeIcon icon={faArrowAltCircleUped} size="xs" className="h-6 w-6" />
                </button>
              </Tooltip>
            }
            <h1 className="text-2xl ml-2">
              {question.text}
            </h1>
          </div>
          <ul className="flex flex-wrapper items-center">
            <li className="text-gray-600 text-xs">
              Asked
              <span className="text-gray-900">
                {` ${moment.unix(question.created).fromNow()}`}
              </span>
            </li>
          </ul>
        </div>
        <Divider />
        <h2 className="text-xl mb-5">
          Answer
        </h2>
        {answers.map((answer, index) => (
          <div key={index}>
            <Comment
              actions={actions}
              author={<a>{answer.user.customName}</a>}
              avatar={
                <Avatar
                  src={answer.user.picture}
                  alt={answer.user.customName}
                />
              }
              content={
                <ReactMarkdown source={answer.answer.content} />
              }
              datetime={
                <Tooltip title={moment.unix(answer.answer.created).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{moment.unix(answer.answer.created).fromNow()}</span>
                </Tooltip>
              }
            />
            <Divider />
          </div>
        ))}
        <h2 className="text-xl mb-5">
          Your answer
        </h2>
        <div className="mb-3">
          <ReactMde
            value={answerValue}
            onChange={setAnswerValue}
            classes={{textArea: 'focus:outline-none'}}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={markdown =>
              Promise.resolve(converter.makeHtml(markdown))
            }
          />
        </div>
        {isPosting &&
          <button
            disabled
            className="text-white p-3 rounded font-medium bg-green-400 hover:bg-green-500 focus:outline-none opacity-50"
          >
            Posting…
          </button>
        }
        {answerValue === '' && !isPosting &&
          <button
            disabled
            className="text-white p-3 rounded font-medium bg-green-400 focus:outline-none opacity-50"
          >
            Post your answer
          </button>
        }
        {answerValue !== '' && !isPosting &&
          <button
            onClick={handlePostAnswer}
            className="text-white p-3 rounded font-medium bg-green-400 hover:bg-green-500 focus:outline-none"
          >
            Post your answer
          </button>
        }
      </div>
    </Layout>
  )
}

QuestionsSlug.getInitialProps = async ({ query }) => {
  const slug = query.slug
  const questionData = await db
    .collection('questions')
    .where('slug', '==', slug)
    .get()
  const question = questionData.docs[0].data()
  const returnQuestion = {
    created: question.created,
    text: question.text,
    id: question.id
  }

  const answerData = await db
    .collection('answers')
    .where('questionId', '==', question.id)
    .get()
  const answers: any = []
  if (answerData.size > 0) {
    await asyncForEach(answerData.docs, async doc => {
      const answer = doc.data()
      const userData = await db
        .collection('publicUsers')
        .doc(answer.answerUserId)
        .get()
      const user = userData.data()
      const returnUser = {
        username: user.username,
        customName: user.customName,
        picture: user.picture
      }
      answers.push({
        answer,
        user: returnUser
      })
    })
  }
  return { question: returnQuestion, answers }
}

export default QuestionsSlug
