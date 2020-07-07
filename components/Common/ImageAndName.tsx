import React from 'react';
import Link from 'next/link';
import Image from './Image';
import FeaturedMark from './FeaturedMark';
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
        <a className="ml-2 font-medium text-gray-800 text-lg">
          {user.customName}
        </a>
      </Link>
      {user.isFeatured && (
        <div className="ml-2">
          <FeaturedMark />
        </div>
      )}
    </div>
  );
};

export default ImageAndName;
