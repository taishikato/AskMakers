import React, { FC } from 'react';
import { facebookShare } from '../../consts/links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

interface IProps {
  url: string;
  text: string;
}

const FacebookLink: FC<IProps> = ({ url, text }) => {
  return (
    <>
      <a
        href={`${facebookShare}?u=${url}`}
        target="_blank"
        className="px-3 py-2 rounded block flex justify-center"
      >
        <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
      </a>
      <style jsx>{`
        a {
          background-color: #4267b2;
          color: white;
        }
      `}</style>
    </>
  );
};

export default FacebookLink;
