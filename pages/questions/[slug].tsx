import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getUnixTime from '../../plugins/getUnixTime';
import Layout from '../../components/Layout';
import asyncForEach from '../../plugins/asyncForEach';
import postAnswer from '../../plugins/postAnswer';
import openNotificationWithIcon from '../../plugins/openNotificationWithIcon';
import AnswerWrapper from '../../components/AnswersSlugId/AnswerWrapper';
import ReactMde from 'react-mde';
import MarkdownIt from 'markdown-it';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { useSelector } from 'react-redux';
import uuid from 'uuid/v4';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import QuestionContext from '../../components/Common/QuestionContext';
import NotFound from '../../components/Common/NotFound';
import FollowButton from '../../components/QuestionsSlug/FollowButton';
import FollowingButton from '../../components/QuestionsSlug/FollowingButton';
import Modal from 'react-modal';
import SignUpModal from '../../components/Navbar/SignUpModal';
import { QUESTIONS_FOLLOW } from '../../consts/FirestoreCollections';
import firebase from '../../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const mdParser = new MarkdownIt();

const deleteTopic = async (questionId: string): Promise<void> => {
  const snapShot = await db
    .collection('questionsTopic')
    .where('questionId', '==', questionId)
    .get();
  if (snapShot.empty) return;
  for (const doc of snapShot.docs) {
    await db.collection('questionsTopic').doc(doc.id).delete();
  }
};

const fetchFollowInfo = async (questionId: string, userId: string) => {
  const snapshot = await db
    .collection(QUESTIONS_FOLLOW)
    .where('questionId', '==', questionId)
    .where('userId', '==', userId)
    .get();
  return snapshot;
};

const QuestionsSlug = ({ question, answers }) => {
  const db = useContext(FirestoreContext);
  const router = useRouter();
  const [answerValue, setAnswerValue] = useState('');
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [isPosting, setIsPosting] = useState(false);
  const loginUser = useSelector((state) => state.loginUser);
  const isLogin = useSelector((state) => state.isLogin);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);

  const shareUrl = `https://askmakers.co${router.asPath}`;

  useEffect(() => {
    const fetch = async () => {
      const snapshot = await fetchFollowInfo(question.id, loginUser.uid);
      if (snapshot.empty) return;
      setFollowing(true);
    };
    if (question.id && isLogin) fetch();
    const fetchCount = async () => {
      const snapshot = await db
        .collection(QUESTIONS_FOLLOW)
        .where('questionId', '==', question.id)
        .get();
      if (snapshot.empty) return;
      setFollowingCount(snapshot.size);
    };
    if (question.id && isLogin) {
      fetch();
      fetchCount();
    }
  }, [question.id, loginUser.uid]);

  const handlePostAnswer = async () => {
    setIsPosting(true);
    const id = uuid().split('-').join('');
    await postAnswer(db, loginUser, question, id, answerValue);
    setIsPosting(false);
    setAnswerValue('');
    openNotificationWithIcon('success', 'Posted your answer successfully');
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure to delete this answer?')) {
      return;
    }
    await db.collection('answers').doc(answerId).delete();
    openNotificationWithIcon('success', 'Deleted successfully');
    router.push('/questions/[slug]', `/questions/${question.slug}`);
  };

  const handleDeleteQuestion = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure to delete this question?')) {
      return;
    }
    await db.collection('questions').doc(question.id).delete();
    await deleteTopic(question.id);
    router.push('/[username]', `/${loginUser.username}`);
  };

  const handleFollowQuestion = async (questionId: string, userId: string) => {
    if (!isLogin) {
      setIsSignupModalOpen(true);
      return;
    }
    await db.collection(QUESTIONS_FOLLOW).add({
      questionId,
      userId,
      created: getUnixTime(),
    });
    setFollowing(true);
    setFollowingCount((prev) => (prev += 1));
  };

  const handleUnfollowQuestion = async (questionId: string, userId: string) => {
    const snapshot = await fetchFollowInfo(questionId, userId);
    if (snapshot.empty) return;
    for (const doc of snapshot.docs) {
      await db.collection(QUESTIONS_FOLLOW).doc(doc.id).delete();
    }
    setFollowing(false);
    setFollowingCount((prev) => (prev -= 1));
  };

  const title = `${question.text} | AskMakers - Ask experienced makers questions`;
  const url = `https://askmakers.co${router.asPath}`;
  const description = 'Check out this question and post your answer!';

  return (
    <Layout>
      <Head>
        <title key="title">{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <link key="canonical" rel="canonical" href={url} />
        <meta key="description" name="description" content={description} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
      </Head>
      {question.id === undefined ? (
        <NotFound />
      ) : (
        <>
          <div className="w-full md:w-7/12 lg:w-7/12 mt-8 m-auto p-3">
            <div>
              <div className="flex flex-wrapper items-center mb-3">
                <QuestionContext question={question}>
                  <ul className="flex flex-wrapper items-center mt-5">
                    <li className="mr-3">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${question.text}`}
                        target="_blank"
                        className="twitter-share"
                      >
                        <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
                      </a>
                    </li>
                    <li className="mr-3">
                      <a
                        href={`https://www.facebook.com/share.php?u=${shareUrl}`}
                        target="_blank"
                        className="facebook-share"
                      >
                        <FontAwesomeIcon
                          icon={faFacebook}
                          className="h-5 w-5"
                        />
                      </a>
                    </li>
                    <li>
                      {following ? (
                        <FollowingButton
                          handleFunction={() =>
                            handleUnfollowQuestion(question.id, loginUser.uid)
                          }
                          followingCount={followingCount}
                        />
                      ) : (
                        <FollowButton
                          handleFunction={() =>
                            handleFollowQuestion(question.id, loginUser.uid)
                          }
                          followingCount={followingCount}
                        />
                      )}
                    </li>
                    {question.fromUserId === loginUser.uid && (
                      <>
                        <li className="text-xs mr-3">
                          <Link
                            href="/edit-question/[slug]"
                            as={`/edit-question/${question.slug}`}
                          >
                            <a className="cursor-pointer hover:underline">
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="h-5 w-5 text-gray-800"
                              />
                            </a>
                          </Link>
                        </li>
                        <li className="text-xs">
                          <button
                            onClick={handleDeleteQuestion}
                            className="block cursor-pointer hover:underline focus:outline-none"
                          >
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="h-5 w-5 text-gray-800"
                            />
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </QuestionContext>
              </div>
            </div>
            {answers.length > 0 && (
              <>
                {answers.map((answer) => (
                  <div key={answer.answer.id} className="mt-4">
                    <AnswerWrapper
                      answerData={{ answer: answer.answer, user: answer.user }}
                      handleDeleteAnswer={handleDeleteAnswer}
                      questionSlug={question.slug}
                      questionTitle={question.text}
                    />
                  </div>
                ))}
              </>
            )}
            <div className="text-xl my-5 font-semibold text-gray-800">
              Your answer
            </div>
            {!isLogin && (
              <Link href="/login">
                <a className="font-semibold text-blue-500 pb-16">
                  Please login or sign up to answer the question.
                </a>
              </Link>
            )}
            {isLogin && (
              <div className="mb-3">
                <ReactMde
                  value={answerValue}
                  onChange={setAnswerValue}
                  classes={{ textArea: 'focus:outline-none' }}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={(markdown) =>
                    Promise.resolve(mdParser.render(markdown))
                  }
                />
              </div>
            )}
            {isPosting && isLogin && (
              <button
                disabled
                className="text-white p-3 rounded font-medium bg-green-400 hover:bg-green-500 focus:outline-none opacity-50"
              >
                Posting…
              </button>
            )}
            {answerValue === '' && !isPosting && isLogin && (
              <button
                disabled
                className="text-white p-3 rounded font-medium bg-green-400 focus:outline-none opacity-50"
              >
                Post your answer
              </button>
            )}
            {answerValue !== '' && !isPosting && isLogin && (
              <button
                onClick={handlePostAnswer}
                className="text-white p-3 rounded font-medium bg-green-400 hover:bg-green-500 focus:outline-none"
              >
                Post your answer
              </button>
            )}
          </div>
          <style jsx>{`
            .twitter-share {
              color: #1da1f2;
            }
            .facebook-share {
              color: #4267b2;
            }
          `}</style>
        </>
      )}
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setIsSignupModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            padding: '1.25rem',
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        <SignUpModal />
      </Modal>
    </Layout>
  );
};

QuestionsSlug.getInitialProps = async ({ query, res }) => {
  const slug = query.slug;
  const questionData = await db
    .collection('questions')
    .where('slug', '==', slug)
    .get();
  if (questionData.empty) {
    res.statusCode = 404;
    return { question: {}, answer: {} };
  }
  const question = questionData.docs[0].data();
  const returnQuestion: IReturnQuestion = {
    created: question.created,
    text: question.text,
    id: question.id,
    slug: question.slug,
    fromUserId: question.fromUserId,
  };
  if (question.body !== undefined) returnQuestion.body = question.body;

  const answerData = await db
    .collection('answers')
    .where('questionId', '==', question.id)
    .get();
  const answers: any = [];
  if (answerData.size > 0) {
    await asyncForEach(answerData.docs, async (doc) => {
      const answer = doc.data();
      const userData = await db
        .collection('publicUsers')
        .doc(answer.answerUserId)
        .get();
      const user = userData.data();
      const returnUser = {
        username: user.username,
        customName: user.customName,
        picture: user.picture,
        isFeatured: user.isFeatured,
      };
      answers.push({
        answer,
        user: returnUser,
      });
    });
  }
  return { question: returnQuestion, answers };
};

interface IReturnQuestion {
  created: number;
  text: string;
  id: string;
  fromUserId: string;
  slug: string;
  body?: string;
}

export default QuestionsSlug;
