import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleUp as faArrowAltCircleUped } from '@fortawesome/free-solid-svg-icons'
import { Comment, Tooltip, Avatar } from 'antd'
import { NextPage } from 'next'
import moment from 'moment'
import ReactMarkdown from 'react-markdown'
import getUnixTime from '../plugins/getUnixTime'
import uuid from 'uuid/v4'
import { useSelector } from 'react-redux'
import asyncForEach from '../plugins/asyncForEach'

const AntCommentWrapper: NextPage<Props> = props => {
  const { answerData, db } = props
  const [upvoteAnswerCount, setUpvoteAnswerCount] = React.useState(0)
  const [isUpvoted, setIsUpvoted] = React.useState(false)
  const loginUser = useSelector(state => state.loginUser)

  const handleUpvote = async () => {
    const id = uuid().split('-').join('')
    await db
      .collection('upvotes')
      .doc(id)
      .set({
        id,
        answerId: answerData.answer.id,
        answerUserId: answerData.answer.answerUserId,
        senderId: loginUser.uid,
        created: getUnixTime(),
      })
    setUpvoteAnswerCount(upvoteAnswerCount + 1)
    setIsUpvoted(true)
  }

  const handleUnUpvote = async () => {
    const upvoteData = await db
      .collection('upvotes')
      .where('answerId', '==', answerData.answer.id)
      .where('senderId', '==', loginUser.uid)
      .get()
    await asyncForEach(upvoteData.docs, async doc => {
      await db
        .collection('upvotes')
        .doc(doc.id)
        .delete()
    })
    setUpvoteAnswerCount(upvoteAnswerCount - 1)
    setIsUpvoted(false)
  }

  React.useEffect(() => {
    const checkUpvoteCount = async () => {
      const upvoteData = await db
        .collection('upvotes')
        .where('answerId', '==', answerData.answer.id)
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
        .where('answerId', '==', answerData.answer.id)
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

  const actions = [
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
      <span style={{ paddingLeft: 8, cursor: 'auto' }}>{upvoteAnswerCount}</span>
    </span>,
  ]

  return (
    <Comment
      actions={actions}
      author={<a>{answerData.user.customName}</a>}
      avatar={
        <Avatar
          src={answerData.user.picture}
          alt={answerData.user.customName}
        />
      }
      content={
        <ReactMarkdown source={answerData.answer.content} />
      }
      datetime={
        <Tooltip title={moment.unix(answerData.answer.created).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment.unix(answerData.answer.created).fromNow()}</span>
        </Tooltip>
      }
    />
  )
}

interface Props {
  answerData: any,
  db: any
}

export default AntCommentWrapper
