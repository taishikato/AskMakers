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
      <ul className="text-lg flex m-auto w-full md:w-10/12 lg:w-10/12">
        <li
          className={`mr-2 ${
            isAnswer ? '' : 'mr-2 border-b-2 border-green-500'
          }`}
        >
          <Link href="/[username]" as={`/${user.username}`}>
            <a
              className={`block p-4
                ${isAnswer ? ' text-gray-700' : ' text-green-500 font-medium'}`}
            >
              Questions
            </a>
          </Link>
        </li>
        <li className={isAnswer ? 'mr-2 border-b-2 border-green-500' : ''}>
          <Link href="/[username]/answers" as={`/${user.username}/answers`}>
            <a
              className={`block p-4
                ${isAnswer ? ' text-green-500 font-medium' : ' text-gray-700'}`}
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
