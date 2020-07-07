import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Layout from '../../components/Layout';
import ContentCard from '../../components/Common/ContentCard';
import FeaturedMaker from '../../components/FeaturedMaker';
import Hero from '../../components/Username/Hero';
import Tabs from '../../components/Username/Tabs';
import Share from '../../components/Username/Share';
import asyncForEach from '../../plugins/asyncForEach';
import NotFound from '../../components/Common/NotFound';
import firebase from '../../plugins/firebase';
import 'firebase/firestore';

interface Props {
  user: any;
  questionsData: any;
}

const db = firebase.firestore();

const NoContent = () => (
  <div className="flex justify-center">
    <div>
      <img src="/no-question.svg" width="200px" alt="No Question yet…" />
      <p className="text-center font-light">No Question yet…</p>
    </div>
  </div>
);

const UsernameIndex: NextPage<Props> = ({ user, questionsData }) => {
  const router = useRouter();
  const title = `${user.customName} | AskMakers - Ask experienced makers questions`;
  const url = `https://askmakers.co${router.asPath}`;

  const textForShare = `${user.customName} on @askmakers_app`;

  // React.useEffect(() => {
  //   const fecth = async () => {
  //     const usersSnap = await db.collection('publicUsers').get();
  //     await Promise.all(
  //       usersSnap.docs.map(async (doc) => {
  //         const user = doc.data();
  //         if (user.uid === undefined) return;
  //         const stg = await db
  //           .collection('publicUsers')
  //           .doc(user.uid)
  //           .collection('settings')
  //           .doc('notifications')
  //           .get();
  //         if (stg.exists) {
  //           console.log(user.customName);
  //           console.log(stg.data());
  //         }
  //       })
  //     );
  //   };
  //   fecth();
  // }, []);

  return (
    <Layout>
      <Head>
        <title key="title">{title}</title>
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:site_name" property="og:site_name" content={title} />
        <meta key="og:url" property="og:url" content={url} />
        <link key="canonical" rel="canonical" href={url} />
      </Head>
      {user.username === undefined ? (
        <NotFound />
      ) : (
        <>
          <Hero user={user} />
          <Tabs user={user} />
          <div className="w-full md:w-10/12 lg:w-10/12 mt-5 mb-10 m-auto">
            <div className="flex flex-wrap md:-mx-4 lg:-mx-4">
              <div className="w-full md:w-8/12 lg:w-8/12 px-1 md:px-4 lg:px-4 mb-5 md:mb-0 lg:mb-0">
                {questionsData.length === 0 && <NoContent />}
                {questionsData.length > 0 &&
                  questionsData.map((question, index) => (
                    <div key={index}>
                      <ContentCard question={{ question }} />
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
        </>
      )}
    </Layout>
  );
};

UsernameIndex.getInitialProps = async ({ query, res }) => {
  // User
  const username = query.username;
  const userData = await db
    .collection('publicUsers')
    .where('username', '==', username)
    .get();
  if (userData.empty) {
    res.statusCode = 404;
    return {
      user: {},
      questionsData: [],
    };
  }
  const user = userData.docs[0].data();
  const returnUser = {
    username: user.username,
    customName: user.customName,
    tagline: user.tagline,
    picture: user.picture,
    social: user.social,
    website: user.website,
    isFeatured: false,
  };

  if (user.isFeatured) returnUser.isFeatured = user.isFeatured;

  let returnQuestion: any = [];
  const questionData = await db
    .collection('questions')
    .where('fromUserId', '==', user.uid)
    .where('isGeneral', '==', true)
    .orderBy('created', 'desc')
    .get();
  // Question
  if (questionData.size > 0) {
    await asyncForEach(questionData.docs, async (doc) => {
      const question = doc.data();
      const [asnswerData, upvoteData] = await Promise.all([
        db.collection('answers').where('questionId', '==', question.id).get(),
        db.collection('upvotes').where('questionId', '==', question.id).get(),
      ]);
      returnQuestion.push({
        id: question.id,
        text: question.text,
        slug: question.slug,
        created: question.created,
        answerCount: asnswerData.size,
        questionUpvoteCount: upvoteData.size,
      });
    });
  }
  return {
    user: returnUser,
    questionsData: returnQuestion,
  };
};

export default UsernameIndex;
