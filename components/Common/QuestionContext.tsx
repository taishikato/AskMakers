import React from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import IQuestion from '../../interfaces/IQuestion';

interface IProps {
  question: IQuestion;
}

const QuestionContext: React.FC<IProps> = ({ question, children }) => {
  return (
    <div className="mb-3 border-3 border-gray-900 p-3 rounded w-full">
      <h1 className="text-xl font-bold">
        <Link href="/questions/[slug]" as={`/questions/${question.slug}`}>
          <a className="text-gray-900">
            <span className="text-3xl text-green-400">
              {question.text.charAt(0)}
            </span>
            {question.text.slice(1)}
          </a>
        </Link>
      </h1>
      {question.body !== '' && (
        <div className="text-lg">
          <ReactMarkdown source={question.body} />
        </div>
      )}
      {children !== undefined && <div className="mt-3">{children}</div>}
    </div>
  );
};

export default QuestionContext;
