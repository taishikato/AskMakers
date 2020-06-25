import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FirestoreContext } from '../contexts/FirestoreContextProvider';
import asyncForEach from '../plugins/asyncForEach';
import Image from './Common/Image';
import IAsnwer from '../interfaces/IAnswer';
import IPublicUser from '../interfaces/IPublicUser';
import IQuestion from '../interfaces/IQuestion';

const AnswerRanking = () => {
  const [answerRanking, setAnswerRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = useContext(FirestoreContext);

  useEffect(() => {
    const fetchAnswerData = async () => {
      setLoading(true);
      const rankingSnapShot = await db
        .collection('upvoteAnswerRanking')
        .orderBy('created', 'desc')
        .limit(1)
        .get();
      const answerRankingArray = [];
      const rankingItem = rankingSnapShot.docs[0].data();
      const answerIdArray = rankingItem.ranking;
      await asyncForEach(answerIdArray, async (answerId) => {
        const answerData = await db.collection('answers').doc(answerId).get();
        const answer = answerData.data() as IAsnwer;
        const [userData, questionData] = await Promise.all([
          db.collection('publicUsers').doc(answer.answerUserId).get(),
          db.collection('questions').doc(answer.questionId).get(),
        ]);
        const user = userData.data() as IPublicUser;
        const question = questionData.data() as IQuestion;

        console.log({ question });

        answerRankingArray.push({ answer, question, user });
      });
      setAnswerRanking(answerRankingArray);
      setLoading(false);
    };

    fetchAnswerData();
  }, []);

  return (
    <div>
      <h2 className="font-bold text-xl text-black flex items-center mb-4">
        <FontAwesomeIcon icon={faPen} className="h-4 w-4 text-green-400 mr-2" />
        <span>Most Upvoted Answers</span>
      </h2>
      {loading ? (
        <>
          <Skeleton active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 3 }} />
        </>
      ) : (
        <>
          {answerRanking.map((answer) => (
            <div
              key={answer.answer.id}
              className="answer-container p-3 border-2 rounded mb-3"
            >
              <div className="text-lg font-normal">
                <Link
                  href="/answers/[slug]/[id]"
                  as={`/answers/${answer.question.slug}/${answer.answer.id}`}
                >
                  <a className="text-gray-800">
                    {answer.answer.content.substr(0, 120)}…
                  </a>
                </Link>
                <div className="flex items-center font-light mt-1">
                  <Link href="/[username]" as={`/${answer.user.username}`}>
                    <a>
                      <Image
                        image={answer.user.picture}
                        alt={answer.user.customname}
                      />
                    </a>
                  </Link>
                  <Link href="/[username]" as={`/${answer.user.username}`}>
                    <a className="ml-2">{answer.user.customName}</a>
                  </Link>
                </div>
                <div className="font-light text-sm mt-2 hover:underline">
                  <Link
                    href={`/questions/[slug]`}
                    as={`/questions/${answer.question.slug}`}
                  >
                    <a>Question: {answer.question.text}</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      <style jsx>{`
        .answer-container {
          border-color: #dddddd;
        }
      `}</style>
    </div>
  );
};

export default AnswerRanking;
