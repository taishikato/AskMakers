import { ReactNode } from 'react';
import Link from 'next/link';
import Image from '../Common/Image';

const SideUser: React.FC<Props> = ({
  name,
  username,
  picture,
  classes,
  intro,
}) => {
  return (
    <div className={classes}>
      <div className="flex flex-wrap items-center">
        <Link href="/[username]" as={`/${username}`}>
          <a>
            <Image image={picture} alt={name} />
          </a>
        </Link>
        <div className="ml-3">
          <Link href="/[username]" as={`/${username}`}>
            <a className="text-gray-800 hover:underline font-semibold hover:no-underline">
              {name}
            </a>
          </Link>
          <div className="text-sm text-gray-700">{intro}</div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  username: string;
  picture: string;
  name: string;
  classes: string;
  intro: ReactNode;
}

export default SideUser;
