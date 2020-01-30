import React from 'react'
import { Tag } from 'antd'
import { NextPage } from 'next'
import Link from 'next/link'
import 'antd/lib/tag/style/index.css'

const QuestionWrapper: NextPage<Props> = props => {
  const questionObj = props.question
  return (
    <div className="flex flex-wrapper tems-center py-3 border-b border-gray-300 rounded">
      <div className="w-3/12 flex flex-wrapper items-center justify-between text-gray-600">
        <div className="flex flex-col items-center p-2">
          <span>1</span>
          <span className="text-xs">votes</span>
        </div>
        <div className="flex flex-col items-center p-2">
          <span>{questionObj.answerCount}</span>
          {questionObj.answerCount === 0 &&
            <span className="text-xs">answer</span>
          }
          {questionObj.answerCount === 1 &&
            <span className="text-xs">answers</span>
          }
          {questionObj.answerCount > 1 &&
            <span className="text-xs">answers</span>
          }
        </div>
        <div className="flex flex-col items-center p-2">
          <span>3</span>
          <span className="text-xs">view</span>
        </div>
      </div>
      <div className="w-9/12 pl-5">
        <h3 className="text-lg">
          <Link href="/questions/[slug]" as={`/questions/${questionObj.question.slug}`}>
            <a>
              {questionObj.question.text}
            </a>
          </Link>
        </h3>
        {questionObj.question.topics.map((topic, index) => {
          let color = ''
          switch(topic) {
            case 'idea':
              color = 'lime'
              break;
            case 'build':
              color = 'geekblue'
              break;
            case 'launch':
              color = 'volcano'
              break;
            case 'grow':
              color = 'green'
              break;
            case 'monetize':
              color = 'gold'
              break;
            case 'automate':
              color = 'orange'
              break;
            case 'exit':
              color = 'purple'
              break
            default:
              break;
          }
          return (
              <Tag color={color} key={index}>{topic}</Tag>
          )
        })}
      </div>
    </div>
  )
}

interface Props {
  question: any
}

export default QuestionWrapper
