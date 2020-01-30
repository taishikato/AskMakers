import React from 'react'
import { Tag } from 'antd'
import 'antd/lib/tag/style/index.css'

const QuestionWrapper = () => {
  return (
    <div className="flex flex-wrapper tems-center py-3 border-b border-gray-300 rounded">
      <div className="w-3/12 flex flex-wrapper items-center justify-between text-gray-600">
        <div className="flex flex-col items-center p-2">
          <span>1</span>
          <span className="text-xs">votes</span>
        </div>
        <div className="flex flex-col items-center p-2">
          <span>2</span>
          <span className="text-xs">answers</span>
        </div>
        <div className="flex flex-col items-center p-2">
          <span>3</span>
          <span className="text-xs">view</span>
        </div>
      </div>
      <div className="w-9/12 pl-5">
        <h3 className="text-lg">
          <a>
            How to make money from app?
          </a>
        </h3>
        <Tag color="magenta">magenta</Tag>
      </div>
    </div>
  )
}

export default QuestionWrapper
