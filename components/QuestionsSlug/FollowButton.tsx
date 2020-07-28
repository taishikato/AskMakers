import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  handleFunction: () => void;
  followingCount: number;
}

const FollowButton: FC<IProps> = ({ handleFunction, followingCount }) => {
  return (
    <button
      onClick={handleFunction}
      className="px-2 py-1 mr-2 text-gray-700 rounded-full flex items-center hover:bg-gray-100 focus:outline-none"
    >
      <FontAwesomeIcon icon={faRss} className="h-4 w-4 mr-1" />
      Follow
      <span className="text-sm ml-1">{followingCount}</span>
    </button>
  );
};

export default FollowButton;
