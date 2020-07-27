import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  handleFunction: () => void;
}

const FollowingButton: FC<IProps> = ({ handleFunction }) => {
  return (
    <button
      onClick={handleFunction}
      className="px-2 py-1 text-blue-500 rounded-full flex items-center hover:bg-gray-100 focus:outline-none"
    >
      <FontAwesomeIcon icon={faRss} className="h-4 w-4 mr-1" />
      Following
    </button>
  );
};

export default FollowingButton;
