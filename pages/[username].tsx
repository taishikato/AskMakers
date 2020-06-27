import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../components/Layout';
import ContentCard from '../components/Common/ContentCard';
import AnswerWrapper from '../components/AnswerWrapper';
import TwitterIcon from '../components/TwitterIcon';
import ProducthuntIcon from '../components/ProducthuntIcon';
import FeaturedMaker from '../components/FeaturedMaker';
import GitHubIcon from '../components/GitHubIcon';
import PatreonIcon from '../components/PatreonIcon';
import asyncForEach from '../plugins/asyncForEach';
import { Tabs, Empty } from 'antd';
import firebase from '../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const Username: NextPage<Props> = (props) => {
  const {
    user,
    questionsData,
    answerCount,
    questionUpvoteCount,
    answerData,
  } = props;
  const { TabPane } = Tabs;
  const router = useRouter();
  const title = `${user.customName} | AskMakers - Ask experienced makers questions`;
  const url = `https://askmakers.co${router.asPath}`;

  return (
    <Layout>
      <Head>
        <title key="title">{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <link key="canonical" rel="canonical" href={url} />
      </Head>
      <div className="bg-gray-100">
        <div className="py-8 m-auto w-9/12">
          <div className="flex flex-wrap text-center md:text-left lg:text-left">
            <div className="w-full md:w-auto lg:w-auto">
              <img
                src={user.picture}
                width="160px"
                className="rounded-full m-auto md:m-0 lg:m-0"
                alt={user.customName}
              />
            </div>
            <div className="w-full md:w-7/12 lg:w-7/12 ml-0 md:ml-5 lg:ml-5">
              <h1 className="font-bold text-4xl">{user.customName}</h1>
              <div>{user.tagline}</div>
              {user.website !== undefined && user.website !== '' && (
                <div>
                  <a href={user.website} target="_blank">
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex flex-wrap mt-4 justify-center md:justify-start lg:justify-start">
                {user.social.twitter !== undefined &&
                  user.social.twitter !== '' && (
                    <div>
                      <TwitterIcon name={user.social.twitter} />
                    </div>
                  )}
                {user.social.productHunt !== undefined &&
                  user.social.productHunt !== '' && (
                    <div>
                      <ProducthuntIcon name={user.social.productHunt} />
                    </div>
                  )}
                {user.social.gitHub !== undefined && user.social.gitHub !== '' && (
                  <div>
                    <GitHubIcon name={user.social.gitHub} />
                  </div>
                )}
                {user.social.patreon !== undefined &&
                  user.social.patreon !== '' && (
                    <div>
                      <PatreonIcon name={user.social.patreon} />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-10/12 lg:w-10/12 mt-5 mb-10 m-auto">
        <div className="flex flex-wrap md:-mx-4 lg:-mx-4">
          <div className="w-full md:w-8/12 lg:w-8/12 px-1 md:px-4 lg:px-4 mb-5 md:mb-0 lg:mb-0">
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span>Questions</span>} key="1">
                {questionsData.length === 0 && (
                  <Empty description="No question yet" />
                )}
                {questionsData.length > 0 &&
                  questionsData.map((question, index) => (
                    <div key={index}>
                      <ContentCard question={{ question }} />
                    </div>
                  ))}
              </TabPane>
              <TabPane tab={<span>Answers</span>} key="2">
                {answerData.length === 0 && (
                  <Empty description="No question yet" />
                )}
                {answerData.length > 0 &&
                  answerData.map((answerRelatedData, index) => (
                    <div key={index}>
                      <AnswerWrapper answerData={answerRelatedData} />
                    </div>
                  ))}
              </TabPane>
            </Tabs>
          </div>
          <div className="w-full md:w-4/12 lg:w-4/12 px-4 mb-10 md:mb-0 lg:mb-0">
            <div className="mt-5">
              <FeaturedMaker />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Username.getInitialProps = async ({ query }) => {
  const username = query.username;
  const userData = await db
    .collection('publicUsers')
    .where('username', '==', username)
    .get();
  const user = userData.docs[0].data();
  const returnUser = {
    customName: user.customName,
    tagline: user.tagline,
    picture: user.picture,
    social: user.social,
    website: user.website,
  };

  let returnQuestion: any = [];
  let answerCount = 0;
  let questionUpvoteCount = 0;
  const [questionData, answerData] = await Promise.all([
    db
      .collection('questions')
      .where('fromUserId', '==', user.uid)
      .where('isGeneral', '==', true)
      .orderBy('created', 'desc')
      .get(),
    db
      .collection('answers')
      .where('answerUserId', '==', user.uid)
      .orderBy('created', 'desc')
      .get(),
  ]);
  // Question
  if (questionData.size > 0) {
    await asyncForEach(questionData.docs, async (doc) => {
      const question = doc.data();
      const [asnswerData, upvoteData] = await Promise.all([
        db.collection('answers').where('questionId', '==', question.id).get(),
        db.collection('upvotes').where('questionId', '==', question.id).get(),
      ]);
      returnQuestion.push({
        text: question.text,
        slug: question.slug,
        created: question.created,
        answerCount: asnswerData.size,
        questionUpvoteCount: upvoteData.size,
      });
    });
  }
  // Answer
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
    questionsData: returnQuestion,
    answerData: returnAnswerData,
    answerCount,
    questionUpvoteCount,
  };
};

interface Props {
  user: any;
  questionsData: any;
  answerCount: number;
  questionUpvoteCount: number;
  answerData: any;
}

export default Username;
