import Link from 'next/link';
import { Skeleton } from 'antd';
import Image from './Common/Image';

interface IProps {
  answerData: any;
}

const RenderRecentAnswers: React.FC<IProps> = ({ answerData }) => {
  if (answerData.length === 0) {
    return <Skeleton avatar paragraph={{ rows: 2 }} />;
  }

  return (
    <>
      {answerData.map((answerObj, index) => (
        <div className="flex flex-wrap py-2" key={index}>
          <Link href="/[username]" as={`/${answerObj.user.username}`}>
            <a className="w-2/12">
              <Image image={answerObj.user.picture} alt={name} />
            </a>
          </Link>
          <div className="w-9/12">
            <Link href="/[username]" as={`/${answerObj.user.username}`}>
              <a>
                <span className="hover:underline font-semibold hover:no-underline">
                  {answerObj.user.customName}
                </span>
              </a>
            </Link>
            <Link
              href="/answers/[slug]/[id]"
              as={`/answers/${answerObj.question.slug}/${answerObj.answer.id}`}
            >
              <a>
                {answerObj.answer.content.length <= 90 ? (
                  <p className="text-sm">{answerObj.answer.content.length}</p>
                ) : (
                  <p className="text-sm">{`${answerObj.answer.content.substr(
                    0,
                    90
                  )}…`}</p>
                )}
              </a>
            </Link>
            <div className="text-xs mt-1">
              <span>Question: </span>
              <Link
                href="/questions/[slug]"
                as={`/questions/${answerObj.question.slug}`}
              >
                <a className="text-gray-800 hover:underline">
                  {answerObj.question.text}
                </a>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default RenderRecentAnswers;
