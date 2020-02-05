import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

const AnswerWrapper: NextPage<Props> = props => (
  <div className="flex flex-wrapper tems-center py-3 border-b border-gray-300 rounded">
    <div className="w-2/12 flex flex-wrapper items-center justify-center text-gray-600 hidden md:flex lg:flex">
      <div className="flex flex-col items-center p-2">
        <span>{props.answerData.answerUpvoteCount}</span>
        {props.answerData.answerUpvoteCount === 0 &&
          <span className="text-xs">upvote</span>
        }
        {props.answerData.answerUpvoteCount === 1 &&
          <span className="text-xs">upvote</span>
        }
        {props.answerData.answerUpvoteCount > 1 &&
          <span className="text-xs">upvotes</span>
        }
      </div>
    </div>
    <div className="w-10/12 pl-5">
      <ul className="flex flex-wrap items-center text-gray-600 text-xs block md:hidden lg:hidden">
        <li className="flex flex-wrap items-center">
        <span className="font-medium pr-1">{props.answerData.answerUpvoteCount}</span>
          {props.answerData.answerUpvoteCount === 0 &&
            <span className="text-xs">upvote</span>
          }
          {props.answerData.answerUpvoteCount === 1 &&
            <span className="text-xs">upvote</span>
          }
          {props.answerData.answerUpvoteCount > 1 &&
            <span className="text-xs">votes</span>
          }
        </li>
      </ul>
      <h3 className="text-lg">
        <Link href="/answers/[slug]/[id]" as={`/answers/${props.answerData.questionSlug}/${props.answerData.answerId}`}>
          <a className="text-gray-800">
            {props.answerData.answerContent}
          </a>
        </Link>
        <div className="text-xs mt-1">
          <span>Question: </span>
          <Link href="/questions/[slug]" as={`/questions/${props.answerData.questionSlug}`}>
            <a className="text-gray-800 hover:underline">
              {props.answerData.questionText}
            </a>
          </Link>
        </div>
      </h3>
    </div>
  </div>
)


interface Props {
  answerData: any
}

export default AnswerWrapper
