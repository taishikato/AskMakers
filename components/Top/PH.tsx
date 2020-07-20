import React from 'react';
import Card from '../../components/Common/Card';

const PH = () => {
  return (
    <Card header="Live on Product Hunt">
      <div className="flex justify-center">
        <a
          href="https://www.producthunt.com/posts/askmakers-2-0?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-askmakers-2-0"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=220336&theme=light"
            alt="AskMakers 2.0 - Ask experienced makers questions💡 | Product Hunt Embed"
            style={{ width: '250px', height: '54px' }}
            width="250px"
            height="54px"
          />
        </a>
      </div>
    </Card>
  );
};

export default PH;
