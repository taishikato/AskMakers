import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import Layout from '../../components/Layout'
import Input from '../../components/Input'
import getUnixTime from '../../plugins/getUnixTime'
import ReactMde from 'react-mde'
import MarkdownIt from 'markdown-it'
import { Checkbox, message } from 'antd'
import firebase from '../../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const mdParser = new MarkdownIt()

const EditQuestionSlug: NextPage<Props> = props => {
  const { question, e } = props

  if (e === 'not allowed') {
    return <Error statusCode={404} />
  }


  const [title, setTitle] = React.useState(question.text)
  const [body, setBody] = React.useState('')
  const [topic, setTopic] = React.useState([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write")

  React.useEffect(() => {
    if (question.topics.length > 0) {
      setTopic(question.topics)
    }
    if (question.body !== undefined) {
      setBody(question.body)
    }
  }, [])


  const topicOptions = [
    { label: 'Idea', value: 'idea' },
    { label: 'Build', value: 'build' },
    { label: 'Launch', value: 'launch' },
    { label: 'Grow', value: 'grow' },
    { label: 'Monetize', value: 'monetize' },
    { label: 'Automate', value: 'automate' },
    { label: 'Exit', value: 'exit' },
  ]

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await db
        .collection('questions')
        .doc(question.id)
        .update({
          updated: getUnixTime(),
          text: title,
          body,
          topics: topic,
        })
      message.success('Submitted successfully')
    } catch(err) {
      message.error('An error occured. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const router = useRouter()

  const pagetitle = `Edit question | AskMakers - Ask experienced makers questions`
  const url = `https://askmakers.co${router.asPath}`
  const description = 'Check out this question and post your answer!'

  return (
    <Layout>
      <Head>
        <meta key="robots" name="robots" content="noindex" />
        <title key="title">{pagetitle}</title>
        <meta
          key="og:title"
          property="og:title"
          content={pagetitle}
        />
        <meta key="og:site_name" property="og:site_name" content={pagetitle} />
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
      <div className="w-full p-2 md:p-0 lg:p-0 md:w-8/12 lg:w-8/12 m-auto my-10">
        <h1 className="text-3xl font-medium mb-5">Ask a question</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Input
              value={title}
              id="title"
              type="text"
              handleChange={e => setTitle(e.target.value)}
              label="Title"
              placeholder="How do you validate your idea?"
              requied={true}
            />
          </div>
          <div className="mb-3">
            <label className="font-semibold mb-2 block">
              <span className="text-red-400">*</span>
              Body
            </label>
            <ReactMde
              value={body}
              onChange={setBody}
              classes={{textArea: 'focus:outline-none'}}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={markdown =>
                Promise.resolve(mdParser.render(markdown))
              }
            />
          </div>
          <div className="mb-5">
            <label className="font-semibold mb-2 block">
              Topic
            </label>
            <div className="flex flex-wrap">
              <Checkbox.Group options={topicOptions} onChange={(checkedValues) => setTopic(checkedValues)} value={topic} />
            </div>
          </div>
          <div>
            {!isSubmitting && (title === '' || body === '') &&
              <button
                className="px-6 py-3 bg-green-300 rounded text-white font-semibold cursor-not-allowed focus:outline-none"
              >
                Update your question
              </button>
            }
            {!isSubmitting && title !== '' && body !== '' &&
              <button
                className="px-6 py-3 bg-green-400 rounded text-white font-semibold hover:bg-green-500 focus:outline-none"
                type="submit"
              >
                Update your question
              </button>
            }
            {isSubmitting &&
              <button
                disabled
                className="px-6 py-3 bg-green-300 rounded text-white font-semibold focus:outline-none"
              >
                Submitting…
              </button>
            }
            <Link href="/questions/[slug]" as={`/questions/${question.slug}`}>
              <a className="px-6 py-3 bg-white rounded font-semibold hover:underline">
                Go back to the question page
              </a>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  )
}

EditQuestionSlug.getInitialProps = async (ctx: any) => {
  const slug = ctx.query.slug
  const questionData = await db
    .collection('questions')
    .where('slug', '==', slug)
    .get()
  const question = questionData.docs[0].data()

  const loginUser = ctx.store.getState().loginUser
  if (loginUser.uid !== question.fromUserId) return { question: {}, e: 'not allowed' }

  return { question }
}

interface Props {
  question: any,
  e?: string
}

export default EditQuestionSlug
