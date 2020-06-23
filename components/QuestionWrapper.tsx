import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';

const QuestionWrapper: NextPage<Props> = (props) => {
  const questionObj = props.question;
  return (
    <div className="flex flex-wrapper tems-center py-3 border-b border-gray-300 rounded">
      <div className="w-2/12 flex flex-wrapper items-center justify-between text-gray-600 hidden md:flex lg:flex">
        <div className="flex flex-col items-center p-2">
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
        </div>
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
        {/* <div className="flex flex-col items-center p-2">
          <span>3</span>
          <span className="text-xs">view</span>
        </div> */}
      </div>
      <div className="w-10/12 pl-5">
        <ul className="flex flex-wrap items-center text-gray-600 text-xs block md:hidden lg:hidden">
          <li className="flex flex-wrap items-center">
            <span className="font-medium pr-1">1</span>
            {questionObj.question.questionUpvoteCount === 0 && (
              <span className="text-xs">upvote</span>
            )}
            {questionObj.question.questionUpvoteCount === 1 && (
              <span className="text-xs">upvote</span>
            )}
            {questionObj.question.questionUpvoteCount > 1 && (
              <span className="text-xs">votes</span>
            )}
          </li>
          <li className="flex flex-wrap items-center ml-3">
            <span className="font-medium pr-1">
              {questionObj.question.answerCount}
            </span>
            {questionObj.question.answerCount === 0 && <span>answer</span>}
            {questionObj.question.answerCount === 1 && <span>answer</span>}
            {questionObj.question.answerCount > 1 && <span>answers</span>}
          </li>
        </ul>
        <h3 className="text-base">
          <Link
            href="/questions/[slug]"
            as={`/questions/${questionObj.question.slug}`}
          >
            <a className="text-gray-800">{questionObj.question.text}</a>
          </Link>
        </h3>
        <div className="flex justify-between items-end mt-1">
          <div>
            {questionObj.question.topics !== undefined &&
              questionObj.question.topics.map((topic, index) => {
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
          <span className="text-xs text-gray-600">
            asked
            <Tooltip
              title={moment
                .unix(questionObj.question.created)
                .format('YYYY-MM-DD HH:mm')}
            >
              <span>
                {' '}
                {moment.unix(questionObj.question.created).fromNow()}
              </span>
            </Tooltip>
          </span>
        </div>
      </div>
    </div>
  );
};

interface Props {
  question: any;
}

export default QuestionWrapper;
