import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import asyncForEach from '../../plugins/asyncForEach';
import postAnswer from '../../plugins/postAnswer';
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
import { message } from 'antd';
import QuestionContext from '../../components/Common/QuestionContext';
import NotFound from '../../components/Common/NotFound';
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

const QuestionsSlug = ({ question, answers }) => {
  const db = useContext(FirestoreContext);
  const router = useRouter();
  const [answerValue, setAnswerValue] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState<'write' | 'preview'>(
    'write'
  );
  const [isPosting, setIsPosting] = React.useState(false);
  const loginUser = useSelector((state) => state.loginUser);
  const isLogin = useSelector((state) => state.isLogin);

  const shareUrl = `https://askmakers.co${router.asPath}`;

  const handlePostAnswer = async () => {
    setIsPosting(true);
    const id = uuid().split('-').join('');
    await postAnswer(db, loginUser, question, id, answerValue);
    setIsPosting(false);
    setAnswerValue('');
    message.success('Submitted successfully');
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure to delete this answer?')) {
      return;
    }
    await db.collection('answers').doc(answerId).delete();
    message.success('Deleted successfully');
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
                        <FontAwesomeIcon
                          icon={faTwitter}
                          size="xs"
                          className="h-5 w-5"
                        />
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
                          size="xs"
                          className="h-5 w-5"
                        />
                      </a>
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
