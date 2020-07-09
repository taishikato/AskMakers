import React, { FC, useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { Tag } from 'antd';
import { FirestoreContext } from '../../contexts/FirestoreContextProvider';

interface Props {
  question: any;
}

const ContentCard: FC<Props> = ({ question }) => {
  const questionObj = question;
  const db = useContext(FirestoreContext);
  const [topics, setTopics] = useState([]);
  const [answerUsers, setAnswerUsers] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const snapShot = await db
        .collection('questionsTopic')
        .where('questionId', '==', questionObj.question.id)
        .get();
      if (snapShot.empty) return;
      const topicsForState = [];
      for (const doc of snapShot.docs) {
        const topicDocument = doc.data();
        topicsForState.push(topicDocument.topic);
      }
      setTopics(topicsForState);
    };
    fetchTopics();

    const fetchAnswerUsers = async () => {
      const answersSnap = await db
        .collection('answers')
        .where('questionId', '==', questionObj.question.id)
        .get();
      if (answersSnap.empty) return;

      const usersList = [];
      for (const doc of answersSnap.docs) {
        const answer = doc.data();
        const userSnap = await db
          .collection('publicUsers')
          .doc(answer.answerUserId)
          .get();
        usersList.push(userSnap.data());
      }
      setAnswerUsers(usersList);
    };
    fetchAnswerUsers();
  }, []);

  return (
    <>
      <div className="question-wrapper flex flex-wrapper items-center py-2 pr-2 mb-3 border-b">
        <div className="w-1/12 flex flex-wrapper items-center justify-between hidden md:flex lg:flex">
          {/* <div className="flex flex-col items-center p-2">
            <span>{questionObj.question.questionUpvoteCount}</span>
            {questionObj.question.questionUpvoteCount === 0 && (
              <span className="text-xs">upvote</span>
            )}
            {questionObj.question.questionUpvoteCount === 1 && (
              <span className="text-xs">upvote</span>
            )}
            {questionObj.question.questionUpvoteCount > 1 && (
              <span className="text-xs">upvotes</span>
            )}
          </div> */}
          <div className="flex flex-col items-center p-2">
            <span>{questionObj.question.answerCount}</span>
            {questionObj.question.answerCount === 0 && (
              <span className="text-xs">answer</span>
            )}
            {questionObj.question.answerCount === 1 && (
              <span className="text-xs">answer</span>
            )}
            {questionObj.question.answerCount > 1 && (
              <span className="text-xs">answers</span>
            )}
          </div>
        </div>
        <div className="w-11/12 pl-5">
          <ul className="flex flex-wrap items-center text-gray-600 text-xs block md:hidden lg:hidden">
            {/* <li className="flex flex-wrap items-center">
              <span className="font-medium pr-1">
                {questionObj.question.questionUpvoteCount}
              </span>
              {questionObj.question.questionUpvoteCount === 0 && (
                <span className="text-xs">upvote</span>
              )}
              {questionObj.question.questionUpvoteCount === 1 && (
                <span className="text-xs">upvote</span>
              )}
              {questionObj.question.questionUpvoteCount > 1 && (
                <span className="text-xs">votes</span>
              )}
            </li> */}
            <li className="flex flex-wrap items-center">
              <span className="font-medium pr-1">
                {questionObj.question.answerCount}
              </span>
              {questionObj.question.answerCount === 0 && <span>answer</span>}
              {questionObj.question.answerCount === 1 && <span>answer</span>}
              {questionObj.question.answerCount > 1 && <span>answers</span>}
            </li>
          </ul>
          <h3 className="text-lg font-semibold">
            <Link
              href="/questions/[slug]"
              as={`/questions/${questionObj.question.slug}`}
            >
              <a className="text-gray-800">{questionObj.question.text}</a>
            </Link>
          </h3>
          {questionObj.question.body !== undefined && (
            <p className="text-gray-700 text-sm font-light">
              {questionObj.question.body.substr(0, 90)}
            </p>
          )}
          {answerUsers.length > 0 && (
            <div className="mt-1">
              {answerUsers.map((user, index) => (
                <Link href="/[username]" as={`/${user.username}`} key={index}>
                  <a>
                    <img
                      src={user.picture}
                      alt={user.customName}
                      className="border w-6 h-6 rounded-full inline mr-1"
                    />
                  </a>
                </Link>
              ))}
            </div>
          )}
          <div className="flex justify-between items-end mt-1">
            <div>
              {topics.map((topic, index) => {
                let color = '';
                switch (topic) {
                  case 'idea':
                    color = 'lime';
                    break;
                  case 'build':
                    color = 'geekblue';
                    break;
                  case 'launch':
                    color = 'volcano';
                    break;
                  case 'grow':
                    color = 'green';
                    break;
                  case 'monetize':
                    color = 'gold';
                    break;
                  case 'automate':
                    color = 'orange';
                    break;
                  case 'exit':
                    color = 'purple';
                    break;
                  default:
                    break;
                }
                return (
                  <Tag color={color} key={index}>
                    {topic}
                  </Tag>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentCard;
