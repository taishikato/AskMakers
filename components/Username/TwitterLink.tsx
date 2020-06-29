import React, { FC } from 'react';
import { twitterShare } from '../../consts/links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

interface IProps {
  url: string;
  text: string;
}

const TwitterLink: FC<IProps> = ({ url, text }) => {
  return (
    <>
      <a
        href={`${twitterShare}?url=${url}&text=${text}`}
        target="_blank"
        className="px-3 py-2 rounded block flex justify-center"
      >
        <FontAwesomeIcon icon={faTwitter} className="h-5 w-5" />
      </a>
      <style jsx>{`
        a {
          background-color: #1da1f2;
          color: white;
        }
      `}</style>
    </>
  );
};

export default TwitterLink;
