import React from 'react';
import Link from 'next/link';
import Card from '../../components/Common/Card';
import Image from '../../components/Common/Image';

const AboutMe = () => {
  return (
    <Card header="Hello!!">
      <div>
        Hi Makers! I am{' '}
        <Link href="/[username]" as="/taishi">
          <a className="mr-1">
            <Image image="/taishi.png" alt="Taishi's profile image" />
          </a>
        </Link>
        <Link href="/[username]" as="/taishi">
          <a>Taishi</a>
        </Link>
        , working on AskMakers 2.0 and looking for a job in Vancouver haha.
        <p>
          I welcome any and all feedback. Shoot me a note at{' '}
          <a
            href="https://twitter.com/askmakers_app"
            target="_blank"
            className="text-blue-500"
          >
            @askmakers_app
          </a>
        </p>
      </div>
    </Card>
  );
};

export default AboutMe;
