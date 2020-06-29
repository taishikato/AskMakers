import React, { FC } from 'react';
import Card from '../../components/Common/Card';
import TwitterLink from './TwitterLink';
import FacebookLink from './FacebookLink';

interface IProps {
  url: string;
  text: string;
}

const Share: FC<IProps> = ({ url, text }) => {
  return (
    <Card header="Share This Profile">
      <div className="flex flex-wrap -mx-2 mt-4">
        <div className="w-1/2 px-2">
          <TwitterLink url={url} text={text} />
        </div>
        <div className="w-1/2 px-2">
          <FacebookLink url={url} text={text} />
        </div>
      </div>
    </Card>
  );
};

export default Share;
