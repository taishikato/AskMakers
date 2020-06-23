import React from 'react';
import Card from './Common/Card';

const WelcomeBox = () => {
  return (
    <Card header="Welcome, new makers :)">
      <div>
        <p>I have been working on AskMakers 2.0 for a couple of weeks.</p>
        <p>
          We welcome any and all feedback. Shoot me a note at{' '}
          <a
            href="https://twitter.com/askmakers_app"
            target="_blank"
            className="text-blue-500"
          >
            @askmakers_app
          </a>{' '}
          👍
        </p>
      </div>
    </Card>
  );
};

export default WelcomeBox;
