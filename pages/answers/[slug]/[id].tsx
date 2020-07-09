import React, { useContext } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import AnswerWrapper from '../../../components/AnswersSlugId/AnswerWrapper';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { message } from 'antd';
import QuestionContext from '../../../components/Common/QuestionContext';
import Devider from '../../../components/Common/Devider';
import CommentForm from '../../../components/AnswersSlugId/CommentForm';
import Comments from '../../../components/AnswersSlugId/Comments';
import { FirestoreContext } from '../../../contexts/FirestoreContextProvider';
import firebase from '../../../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const AnswersSlugId: NextPage<Props> = ({ question, answer, user }) => {
  const router = useRouter();
  const db = useContext(FirestoreContext);

  const handleDeleteAnswer = async (answerId) => {
    if (!window.confirm('Are you sure to delete this answer?')) {
      return;
    }
    await db.collection('answers').doc(answerId).delete();
    message.success('Deleted successfully');
    router.push('/questions/[slug]', `/questions/${question.slug}`);
  };

  const title = `The answer to ${question.text} by @${user.username} | AskMakers - Ask experienced makers questions`;
  const url = `https://askmakers.co${router.asPath}`;
  const description = answer.content;

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
      <div className="w-full md:w-7/12 lg:w-7/12 mt-8 m-auto p-3">
        <QuestionContext question={question} />
        <AnswerWrapper
          answerData={{ answer, user }}
          handleDeleteAnswer={handleDeleteAnswer}
          questionSlug={question.slug}
          questionTitle={question.text}
        />
        <Devider />
        <CommentForm answerId={answer.id} />
        <Comments answerId={answer.id} />
      </div>
    </Layout>
  );
};

AnswersSlugId.getInitialProps = async ({ query }) => {
  const [questionData, answerData] = await Promise.all([
    db.collection('questions').where('slug', '==', query.slug).get(),
    db.collection('answers').where('id', '==', query.id).get(),
  ]);
  const question = questionData.docs[0].data();
  const answer = answerData.docs[0].data();
  const userData = await db
    .collection('publicUsers')
    .where('uid', '==', answer.answerUserId)
    .get();
  const user = userData.docs[0].data();
  return {
    question,
    answer,
    user: {
      customName: user.customName,
      username: user.username,
      picture: user.picture,
      isFeatured: user.isFeatured,
    },
  };
};

interface Props {
  question: any;
  answer: any;
  user: any;
}

export default AnswersSlugId;
