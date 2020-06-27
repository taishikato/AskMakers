import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import IPublicUser from '../../interfaces/IPublicUser';

interface IProps {
  user: IPublicUser;
}

const Tabs: React.FC<IProps> = ({ user }) => {
  const router = useRouter();
  const isAnswer = /answer/.test(router.asPath);

  return (
    <div className="border-b">
      <ul className="flex m-auto w-full md:w-10/12 lg:w-10/12">
        <li className="mr-2 p-1">
          <Link href="/[username]" as={`/${user.username}`}>
            <a
              className={`block
                ${
                  isAnswer
                    ? ' text-gray-700 p-2'
                    : ' text-green-400 font-medium p-2'
                }`}
            >
              Questions
            </a>
          </Link>
        </li>
        <li className="p-1">
          <Link href="/[username]/answers" as={`/${user.username}/answers`}>
            <a
              className={`block
                ${
                  isAnswer
                    ? ' text-green-400 font-medium p-2 block'
                    : ' text-gray-700 p-2 block'
                }`}
            >
              Answers
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
