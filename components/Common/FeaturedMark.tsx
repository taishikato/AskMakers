import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

const FeaturedMark = () => {
  return (
    <Tooltip title="Featured Maker">
      <div className="bg-blue-400 text-white h-5 w-5 rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faStar} className="h-3 w-3" />
      </div>
    </Tooltip>
  );
};

export default FeaturedMark;
