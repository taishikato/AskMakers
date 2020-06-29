import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import FeaturedMaker from '../components/FeaturedMaker';
import ContentCard from '../components/Common/ContentCard';
import ABoutMe from '../components/Top/AboutMe';
import RecentAnswer from '../components/RecentAnswer';
import AnswerRanking from '../components/AnswerRanking';
import asyncForEach from '../plugins/asyncForEach';
import firebase from '../plugins/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const Home: NextPage<Props> = () => {
  const [quesionsContainer, setQuesionsContainer] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isLoadingMoreQuestions, setIsLoadingMoreQuestions] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<ISingleQuestion>();
  const isLogin = useSelector((state) => state.isLogin);

  useEffect(() => {
    const getQuestions = async () => {
      setIsLoadingQuestions(true);
      const questionData = await db
        .collection('questions')
        .orderBy('created', 'desc')
        .limit(10)
        .get();
      const questions: any = [];
      await asyncForEach(questionData.docs, async (doc) => {
        const question = doc.data();
        const [userData, answerData, upvoteData] = await Promise.all([
          db.collection('publicUsers').doc(question.fromUserId).get(),
          db.collection('answers').where('questionId', '==', question.id).get(),
          db
            .collection('questionUpvotes')
            .where('questionId', '==', question.id)
            .get(),
        ]);
        const user = userData.data();
        question.answerCount = answerData.size;
        question.questionUpvoteCount = upvoteData.size;
        questions.push({ question, user });
      });
      setQuesionsContainer(questions);
      setIsLoadingQuestions(false);
    };
    getQuestions();
  }, []);

  useEffect(() => {
    if (quesionsContainer.length > 0) {
      setLastQuestion(quesionsContainer[quesionsContainer.length - 1].question);
    }
  }, [quesionsContainer]);

  const loadMoreQuestions = async (e) => {
    e.preventDefault();
    setIsLoadingMoreQuestions(true);
    const quesionsContainerCopy = [...quesionsContainer];
    const questionData = await db
      .collection('questions')
      .where('created', '<', lastQuestion.created)
      .orderBy('created', 'desc')
      .limit(10)
      .get();
    await asyncForEach(questionData.docs, async (doc) => {
      const question = doc.data();
      const [userData, answerData, upvoteData] = await Promise.all([
        db.collection('publicUsers').doc(question.fromUserId).get(),
        db.collection('answers').where('questionId', '==', question.id).get(),
        db
          .collection('questionUpvotes')
          .where('questionId', '==', question.id)
          .get(),
      ]);
      const user = userData.data();
      question.answerCount = answerData.size;
      question.questionUpvoteCount = upvoteData.size;
      quesionsContainerCopy.push({ question, user });
    });
    setQuesionsContainer(quesionsContainerCopy);
    setIsLoadingMoreQuestions(false);
  };

  return (
    <Layout>
      {!isLogin && <Hero />}
      <div className="w-full md:w-11/12 lg:w-11/12 mt-5 mb-10 m-auto">
        <div className="w-full flex flex-wrap px-2 md:-mx-4 lg:-mx-4">
          <div className="w-full mb-5 md:w-8/12 lg:w-8/12 md:px-4 lg:px-4">
            <AnswerRanking />
            <h2 className="font-bold text-xl text-black mt-10 flex items-center">
              <FontAwesomeIcon
                icon={faQuestion}
                className="mr-2 w-4 h-4 text-yellow-500"
              />
              Recent Questions
            </h2>
            {isLoadingQuestions ? (
              <>
                <Skeleton active paragraph={{ rows: 3 }} />
                <Skeleton active paragraph={{ rows: 3 }} />
                <Skeleton active paragraph={{ rows: 3 }} />
              </>
            ) : (
              <>
                {quesionsContainer.map((question, index) => (
                  <ContentCard question={question} key={index} />
                ))}
                {isLoadingMoreQuestions ? (
                  <button
                    className="block m-auto rounded bg-green-200 py-2 px-4 text-white"
                    disabled
                  >
                    Loading…
                  </button>
                ) : (
                  <button
                    className="block m-auto rounded bg-green-400 py-2 px-4 text-white"
                    onClick={loadMoreQuestions}
                  >
                    Load more
                  </button>
                )}
              </>
            )}
          </div>
          <aside
            className="w-full md:w-4/12 lg:w-4/12 md:px-4 lg:px-4
          "
          >
            <FeaturedMaker />
            <RecentAnswer />
            <ABoutMe />
            <div className="text-xs text-gray-600">
              <div className="mb-3">
                <Link href="/">
                  <a>AskMakers</a>
                </Link>
                , made by{' '}
                <a href="https://twitter.com/askmakers_app" target="_blank">
                  Taishi Kato
                </a>{' '}
                Ⓒ 2020
                <div>Stay weird, stay creative ☁️</div>
              </div>
              <Link href="/terms-privacy">
                <a>Terms of Service & Privacy</a>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

interface Props {
  questions: any;
}

interface ISingleQuestion {
  created: number;
  fromUserId: string;
  id: string;
  image: string;
  isAnswered: boolean;
  isGeneral: boolean;
  slug: string;
  text: string;
  topics: {};
  answerCount: number;
  questionUpvoteCount: number;
}

export default Home;
