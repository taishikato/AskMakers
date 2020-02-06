import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import AntCommentWrapper from '../../../components/AntCommentWrapper'
import upvoteQuestion from '../../../plugins/upvoteQuestion'
import unUpvoteQuestion from '../../../plugins/unUpvoteQuestion'
import postAnswer from '../../../plugins/postAnswer'
import { useSelector } from 'react-redux'
import moment from 'moment'
import uuid from 'uuid/v4'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import MarkdownIt from 'markdown-it'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleUp as faArrowAltCircleUped } from '@fortawesome/free-solid-svg-icons'
import firebase from '../../../plugins/firebase'
import { Tooltip, Divider, message } from 'antd'
import ReactMarkdown from 'react-markdown'
import 'firebase/firestore'

const db = firebase.firestore()

const mdParser = new MarkdownIt()

const AnswersSlugId: NextPage<Props> = props => {
  const { question, answer, user } = props
  const router = useRouter()
  const [answerValue, setAnswerValue] = React.useState('')
  const [isPosting, setIsPosting] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write")
  const [isQuestionUpvoted, setIsQuestionUpvoted] = React.useState(false)
  const loginUser = useSelector(state => state.loginUser)

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure to delete this answer?')) {
      return
    }
    await db
      .collection('answers')
      .doc(answerId)
      .delete()
    message.success('Deleted successfully')
    router.push('/questions/[slug]', `/questions/${question.slug}`)
  }

  React.useEffect(() => {
    const checkUpvoted = async () => {
      const questionUpvoteData = await db
        .collection('questionUpvotes')
        .where('userId', '==', loginUser.uid)
        .where('questionId', '==', question.id)
        .get()
      if (questionUpvoteData.size === 0) {
        return
      }
      setIsQuestionUpvoted(true)
    }
    if (Object.keys(loginUser).length > 0) { 
      checkUpvoted()
    }
  }, [loginUser])

  const handleUpvoteQuestion = async e => {
    e.preventDefault()
    await upvoteQuestion(db, loginUser, question)
    setIsQuestionUpvoted(true)
  }

  const handleUnUpvoteQuestion = async e => {
    e.preventDefault()
    await unUpvoteQuestion(db, loginUser, question)
    setIsQuestionUpvoted(false)
  }

  const handleDeleteQuestion = async e => {
    e.preventDefault()
    if (!window.confirm('Are you sure to delete this question?')) {
      return
    }
    await db.collection('questions').doc(question.id).delete()
    router.push('/')
  }

  const handlePostAnswer = async () => {
    setIsPosting(true)
    const id = uuid().split('-').join('')
    await postAnswer(db, loginUser, question, id, answerValue)
    setIsPosting(false)
    setAnswerValue('')
    message.success('Submitted successfully')
  }

  const title = `The answer to ${question.text} by ${user.username} | AskMakers - Ask experienced makers questions`
  const url = `https://askmakers.co${router.asPath}`
  const description = answer.content

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
        <meta
          key="description"
          name="description"
          content={description}
        />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
      </Head>
      <div className="w-full md:w-7/12 lg:w-7/12 mt-8 m-auto p-3">
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
              <Link href="/questions/[slug]" as={`/questions/${question.slug}`}>
                <a>
                  {question.text}
                </a>
              </Link>
            </h1>
          </div>
          <ul className="flex flex-wrapper items-center">
            <li className="text-gray-600 text-xs">
              Asked
              <span className="text-gray-900">
                {` ${moment.unix(question.created).fromNow()}`}
              </span>
            </li>
            {question.fromUserId === loginUser.uid &&
              <>
                <li className="text-gray-600 text-xs ml-3">
                  <Link href="/edit-question/[slug]" as={`/edit-question/${question.slug}`}>
                    <a className="cursor-pointer hover:underline">
                      Edit
                    </a>
                  </Link>
                </li>
                <li className="text-gray-600 text-xs ml-3">
                  <button
                    onClick={handleDeleteQuestion}
                    className="cursor-pointer hover:underline focus:outline-none"
                  >
                    Delete
                  </button>
                </li>
              </>
            }
          </ul>
        </div>
        {question.body !== undefined &&
          <div className="mt-5">
            <ReactMarkdown source={question.body} />
            <Divider />
          </div>
        }
        <h2 className="text-xl my-5">
          Answer
        </h2>
        <AntCommentWrapper answerData={{ answer, user }} db={db} handleDeleteAnswer={handleDeleteAnswer} questionSlug={question.slug} questionTitle={answer.text} />
        <Divider />
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
              Promise.resolve(mdParser.render(markdown))
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

AnswersSlugId.getInitialProps = async ({ query }) => {
  const [questionData, answerData] = await Promise.all([
    db
      .collection('questions')
      .where('slug', '==', query.slug)
      .get(),
    db
      .collection('answers')
      .where('id', '==', query.id)
      .get()
  ])
  const question = questionData.docs[0].data()
  const answer =　answerData.docs[0].data()
  const userData = await db
    .collection('publicUsers')
    .where('uid', '==', answer.answerUserId)
    .get()
  const user = userData.docs[0].data()
  return {
    question,
    answer,
    user: {
      customName: user.customName,
      username: user.username,
      picture: user.picture
    }
  }
}

interface Props {
  question: any
  answer: any,
  user: any
}

export default AnswersSlugId
