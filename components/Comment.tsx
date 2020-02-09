import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import getUnixTime from '../plugins/getUnixTime'
import asyncForEach from '../plugins/asyncForEach'
import ReactMarkdown from 'react-markdown'
import { Tooltip } from 'antd'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleUp as faArrowAltCircleUped } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'
import uuid from 'uuid/v4'

const Comment: NextPage<Props> = props => {
  const { name, userId, username, picture, datetime, answer, answerId, questionTitle, questionSlug, db } = props
  const [isUpvoted, setIsUpvoted] = React.useState(false)
  const [upvoteAnswerCount, setUpvoteAnswerCount] = React.useState(0)
  const loginUser = useSelector(state => state.loginUser)
  const isLogin = useSelector(state => state.isLogin)
  const router = useRouter()

  const handleUpvote = async () => {
    if (!isLogin) {
      router.push('/login')
      return
    }
    const id = uuid().split('-').join('')
    await db
      .collection('upvotes')
      .doc(id)
      .set({
        id,
        answerId,
        answerUserId: userId,
        senderId: loginUser.uid,
        created: getUnixTime(),
      })
    setUpvoteAnswerCount(upvoteAnswerCount + 1)
    setIsUpvoted(true)
  }

  const handleUnUpvote = async () => {
    if (!isLogin) {
      router.push('/login')
      return
    }
    const upvoteData = await db
      .collection('upvotes')
      .where('answerId', '==', answerId)
      .where('senderId', '==', loginUser.uid)
      .get()
    await asyncForEach(upvoteData.docs, async doc => {
      await db.collection('upvotes').doc(doc.id).delete()
    })
    setUpvoteAnswerCount(upvoteAnswerCount - 1)
    setIsUpvoted(false)
  }

  React.useEffect(() => {
    const checkUpvoteCount = async () => {
      const upvoteData = await db
        .collection('upvotes')
        .where('answerId', '==', answerId)
        .get()
      if (upvoteData.size === 0) {
        return
      }
      setUpvoteAnswerCount(upvoteData.size)
    }
    checkUpvoteCount()
  }, [])

  React.useEffect(() => {
    const checkUpvoted = async () => {
      const upvoteData = await db
        .collection('upvotes')
        .where('senderId', '==', loginUser.uid)
        .where('answerId', '==', answerId)
        .get()
      if (upvoteData.size === 0) {
        return
      }
      setIsUpvoted(true)
    }
    if (Object.keys(loginUser).length > 0) {
      checkUpvoted()
    }
  }, [loginUser])

  const shareUrl = `https://askmakers.co/answers/${questionSlug}/${answerId}`

  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3">
        <Link href="/[username]" as={`/${username}`}>
          <a>
            <img src={picture} className="w8 h-8 rounded-full" />
          </a>
        </Link>
      </div>
      <div>
        <div className="flex items-center text-sm mb-3">
          <Link href="/[username]" as={`/${username}`}>
            <a className="text-gray-600 mr-3">
              {name}
            </a>
          </Link>
          <Link href="/answers/[slug]/[id]" as={`/answers/${questionSlug}/${answerId}`}>
            <a className="text-gray-500">
              <Tooltip title={moment.unix(datetime).format('YYYY-MM-DD HH:mm')}>
                <span>{moment.unix(datetime).fromNow()}</span>
              </Tooltip>
            </a>
          </Link>
        </div>
        <div id="content" className="mb-2 whitespace-pre-wrap">
          <ReactMarkdown source={answer} />
        </div>
        <div className="flex items-center">
          <span key="comment-basic-like" className="flex flex-wrapper items-center">
            {!isUpvoted ?
              <Tooltip title="Upvote">
                <button onClick={handleUpvote} className="focus:outline-none">
                  <FontAwesomeIcon icon={faArrowAltCircleUp} size="xs" className="h-4 w-4" />
                </button>
              </Tooltip> :
              <Tooltip title="Upvoted">
                <button onClick={handleUnUpvote} className="focus:outline-none">
                  <FontAwesomeIcon icon={faArrowAltCircleUped} size="xs" className="h-4 w-4" />
                </button>
              </Tooltip>
            }
            <span className="text-sm" style={{ paddingLeft: 8, cursor: 'auto' }}>{upvoteAnswerCount}</span>
          </span>
          <span className="flex flex-wrapper items-center ml-3">
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=The answer to ${questionTitle} by @${username}`} target="_blank" className="twitter-share">
              <FontAwesomeIcon icon={faTwitter} size="xs" className="h-4 w-4" />
            </a>
          </span>
          <span className="flex flex-wrapper items-center ml-3">
            <a href={`https://www.facebook.com/share.php?u=${shareUrl}`} target="_blank" className="facebook-share">
              <FontAwesomeIcon icon={faFacebook} size="xs" className="h-4 w-4" />
            </a>
          </span>
          <span className="flex ml-3">
            {loginUser.uid === userId &&
              <Tooltip title="Delete">
                <button onClick={() => props.handleDeleteAnswer(answerId)} className="focus:outline-none">
                  <FontAwesomeIcon icon={faTrashAlt} size="xs" className="h-4 w-4" />
                </button>
              </Tooltip>
            }
          </span>
        </div>
      </div>
      <style jsx>{`
      .twitter-share {
        color: #1DA1F2;
      }
      .facebook-share {
        color: #4267B2;
      }
      `}</style>
    </div>
  )
}

interface Props {
  name: string
  username: string
  userId: string
  picture: string
  datetime: number
  answer: string
  answerId: string
  questionSlug: string
  questionTitle: string
  db: any
  handleDeleteAnswer: any
}

export default Comment
