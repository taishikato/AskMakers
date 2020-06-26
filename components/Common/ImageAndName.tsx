import React from 'react';
import Link from 'next/link';
import Image from './Image';
import IPublicUser from '../../interfaces/IPublicUser';

interface Iprops {
  user: IPublicUser;
}

const ImageAndName: React.FC<Iprops> = ({ user }) => {
  return (
    <div className="flex items-center">
      <Link href="/[username]" as={`/${user.username}`}>
        <a>
          <Image image={user.picture} alt={user.username} />
        </a>
      </Link>
      <Link href="/[username]" as={`/${user.username}`}>
        <a className="ml-2 font-medium">{user.customName}</a>
      </Link>
    </div>
  );
};

export default ImageAndName;
