import React from 'react'
import { NextPage } from 'next'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import MarkdownIt from 'markdown-it'

const mdParser = new MarkdownIt()

const AnswerForm: NextPage<Props> = props => {
  const [answerValue, setAnswerValue] = React.useState('')
  const [isPosting, setIsPosting] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write")

  const handlePostAnswer = async () => {
    setIsPosting(true)
    await props.handlePostAnswer()
    setIsPosting(false)
  }

  return (
    <>
      <div className="mb-3">
        <ReactMde
          value={answerValue}
          onChange={setAnswerValue}
          classes={{textArea: 'focus:outline-none'}}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={markdown =>
            Promise.resolve(mdParser.render(markdown))
          }
        />
      </div>
      {isPosting &&
        <button
          disabled
          className="text-white p-3 rounded font-medium bg-green-400 hover:bg-green-500 focus:outline-none opacity-50"
        >
          Posting…
        </button>
      }
      {answerValue === '' && !isPosting &&
        <button
          disabled
          className="text-white p-3 rounded font-medium bg-green-400 focus:outline-none opacity-50"
        >
          Post your answer
        </button>
      }
      {answerValue !== '' && !isPosting &&
        <button
          onClick={handlePostAnswer}
          className="text-white p-3 rounded font-medium bg-green-400 hover:bg-green-500 focus:outline-none"
        >
          Post your answer
        </button>
      }
    </>
  )
}

interface Props {
  handlePostAnswer: () => Promise<any>
}

export default AnswerForm