import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowAltCircleUp,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleUp as faArrowAltCircleUped } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Tooltip } from 'antd';
import ReactMarkdown from 'react-markdown';
import ImageAndName from '../Common/ImageAndName';
import getUnixTime from '../../plugins/getUnixTime';
import uuid from 'uuid/v4';
import { useSelector } from 'react-redux';
import asyncForEach from '../../plugins/asyncForEach';
import { useRouter } from 'next/router';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';

const AnswerWrapper: React.FC<Props> = ({
  answerData,
  questionSlug,
  questionTitle,
  handleDeleteAnswer,
}) => {
  const db = useContext(FirestoreContext);
  const [upvoteAnswerCount, setUpvoteAnswerCount] = useState(0);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const loginUser = useSelector((state) => state.loginUser);
  const isLogin = useSelector((state) => state.isLogin);
  const router = useRouter();

  const handleUpvote = async () => {
    if (!isLogin) {
      router.push('/login');
      return;
    }
    const id = uuid().split('-').join('');
    await db.collection('upvotes').doc(id).set({
      id,
      answerId: answerData.answer.id,
      answerUserId: answerData.answer.answerUserId,
      senderId: loginUser.uid,
      created: getUnixTime(),
    });
    setUpvoteAnswerCount(upvoteAnswerCount + 1);
    setIsUpvoted(true);
  };

  const handleUnUpvote = async () => {
    if (!isLogin) {
      router.push('/login');
      return;
    }
    const upvoteData = await db
      .collection('upvotes')
      .where('answerId', '==', answerData.answer.id)
      .where('senderId', '==', loginUser.uid)
      .get();
    await asyncForEach(upvoteData.docs, async (doc) => {
      await db.collection('upvotes').doc(doc.id).delete();
    });
    setUpvoteAnswerCount(upvoteAnswerCount - 1);
    setIsUpvoted(false);
  };

  useEffect(() => {
    const checkUpvoteCount = async () => {
      const upvoteData = await db
        .collection('upvotes')
        .where('answerId', '==', answerData.answer.id)
        .get();
      if (upvoteData.size === 0) {
        return;
      }
      setUpvoteAnswerCount(upvoteData.size);
    };
    checkUpvoteCount();
  }, []);

  useEffect(() => {
    const checkUpvoted = async () => {
      const upvoteData = await db
        .collection('upvotes')
        .where('senderId', '==', loginUser.uid)
        .where('answerId', '==', answerData.answer.id)
        .get();
      if (upvoteData.size === 0) {
        return;
      }
      setIsUpvoted(true);
    };
    if (Object.keys(loginUser).length > 0) {
      checkUpvoted();
    }
  }, [loginUser]);

  const shareUrl = `https://askmakers.co/answers/${questionSlug}/${answerData.answer.id}`;

  return (
    <>
      <div className="container text-xl font-light p-3 border-2 rounded">
        <ReactMarkdown source={answerData.answer.content} />
        <div className="mt-3">
          <ImageAndName user={answerData.user} />
        </div>
        <div className="flex items-center mt-4">
          <span key="comment-basic-like" className="flex items-center mr-3">
            {!isUpvoted ? (
              <Tooltip title="Upvote">
                <button onClick={handleUpvote} className="focus:outline-none">
                  <FontAwesomeIcon
                    icon={faArrowAltCircleUp}
                    className="h-5 w-5 text-green-500"
                  />
                </button>
              </Tooltip>
            ) : (
              <Tooltip title="Upvoted">
                <button onClick={handleUnUpvote} className="focus:outline-none">
                  <FontAwesomeIcon
                    icon={faArrowAltCircleUped}
                    className="h-5 w-5 text-green-500"
                  />
                </button>
              </Tooltip>
            )}
            <span
              className="text-base text-green-500 font-normal pl-1"
              style={{ cursor: 'auto' }}
            >
              {upvoteAnswerCount}
            </span>
          </span>
          <span className="mr-3">
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=The answer to ${questionTitle} by @${answerData.user.username}`}
              target="_blank"
              className="twitter-share"
            >
              <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
            </a>
          </span>
          <span className="mr-3">
            <a
              href={`https://www.facebook.com/share.php?u=${shareUrl}`}
              target="_blank"
              className="facebook-share"
            >
              <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
            </a>
          </span>
          <span>
            {loginUser.uid === answerData.answer.answerUserId && (
              <button
                onClick={() => handleDeleteAnswer(answerData.answer.id)}
                className="block focus:outline-none"
              >
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  size="xs"
                  className="h-5 w-5"
                />
              </button>
            )}
          </span>
        </div>
      </div>
      <style jsx>{`
        .container {
          border-color: #dddddd;
        }
        .twitter-share {
          color: #1da1f2;
        }
        .facebook-share {
          color: #4267b2;
        }
      `}</style>
    </>
  );
};

interface Props {
  answerData: any;
  handleDeleteAnswer: any;
  questionSlug: string;
  questionTitle: string;
}

export default AnswerWrapper;
