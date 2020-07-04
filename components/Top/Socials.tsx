import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faDev,
  faProductHunt,
} from '@fortawesome/free-brands-svg-icons';

const Socials = () => {
  return (
    <ul className="flex justify-center -mx-2 mb-4">
      <li className="px-2">
        <a
          href="https://taishikato.com/"
          target="_blank"
          className="text-gray-500"
        >
          <FontAwesomeIcon icon={faHome} className="h-6 w-6" />
        </a>
      </li>
      <li className="px-2">
        <a
          href="https://twitter.com/askmakers_app"
          target="_blank"
          className="text-gray-500"
        >
          <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
        </a>
      </li>
      <li className="px-2">
        <a
          href="https://dev.to/taishi"
          target="_blank"
          className="text-gray-500"
        >
          <FontAwesomeIcon icon={faDev} className="h-6 w-6" />
        </a>
      </li>
      <li className="px-2">
        <a
          href="https://www.producthunt.com/@taishi_kato"
          target="_blank"
          className="text-gray-500"
        >
          <FontAwesomeIcon icon={faProductHunt} className="h-6 w-6" />
        </a>
      </li>
    </ul>
  );
};

export default Socials;
