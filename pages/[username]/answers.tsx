import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import AnswerWrapper from '../../components/AnswerWrapper';
import FeaturedMaker from '../../components/FeaturedMaker';
import Share from '../../components/Username/Share';
import asyncForEach from '../../plugins/asyncForEach';
import Hero from '../../components/Username/Hero';
import Tabs from '../../components/Username/Tabs';
import IPublicUser from '../../interfaces/IPublicUser';
import IAnswer from '../../interfaces/IAnswer';
import firebase from '../../plugins/firebase';
import 'firebase/firestore';

interface Props {
  user: IPublicUser;
  answerData: IAnswer[];
}

const db = firebase.firestore();

const NoContent = () => (
  <div className="flex justify-center">
    <div>
      <img src="/no-question.svg" width="200px" alt="No Question yet…" />
      <p className="text-center font-light">No Answer yet…</p>
    </div>
  </div>
);

const UsernameAnswers: NextPage<Props> = ({ user, answerData }) => {
  const router = useRouter();
  const title = `${user.customName} | AskMakers - Ask experienced makers questions`;
  const url = `https://askmakers.co${router.asPath}`;
  const textForShare = `${user.customName} on @askmakers_app`;

  return (
    <Layout>
      <Head>
        <title key="title">{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <link key="canonical" rel="canonical" href={url} />
      </Head>
      <Hero user={user} />
      <Tabs user={user} />
      <div className="w-full md:w-10/12 lg:w-10/12 mt-5 mb-10 m-auto">
        <div className="flex flex-wrap md:-mx-4 lg:-mx-4">
          <div className="w-full md:w-8/12 lg:w-8/12 px-1 md:px-4 lg:px-4 mb-5 md:mb-0 lg:mb-0">
            {answerData.length === 0 && <NoContent />}
            {answerData.length > 0 &&
              answerData.map((answerRelatedData, index) => (
                <div key={index}>
                  <AnswerWrapper answerData={answerRelatedData} />
                </div>
              ))}
          </div>
          <div className="w-full md:w-4/12 lg:w-4/12 px-4 mb-10 md:mb-0 lg:mb-0">
            <div className="mt-5">
              <Share url={url} text={textForShare} />
              <FeaturedMaker />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

UsernameAnswers.getInitialProps = async ({ query }) => {
  // User
  const username = query.username;
  const userData = await db
    .collection('publicUsers')
    .where('username', '==', username)
    .get();
  const user = userData.docs[0].data();
  const returnUser = {
    username: user.username,
    customName: user.customName,
    tagline: user.tagline,
    picture: user.picture,
    social: user.social,
    website: user.website,
  };

  // Answer
  const answerData = await db
    .collection('answers')
    .where('answerUserId', '==', user.uid)
    .orderBy('created', 'desc')
    .get();
  let returnAnswerData: any = [];
  if (answerData.size > 0) {
    await asyncForEach(answerData.docs, async (doc) => {
      const answer = doc.data();
      const [questionData, upvoteData] = await Promise.all([
        db.collection('questions').where('id', '==', answer.questionId).get(),
        db.collection('upvotes').where('answerId', '==', answer.id).get(),
      ]);
      const question = questionData.docs[0].data();
      returnAnswerData.push({
        answerContent: answer.content,
        answerId: answer.id,
        answerUpvoteCount: upvoteData.size,
        questionSlug: question.slug,
        questionText: question.text,
      });
    });
  }
  return {
    user: returnUser,
    answerData: returnAnswerData,
  };
};

export default UsernameAnswers;
