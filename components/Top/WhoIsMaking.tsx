import React from 'react';
import Socials from './Socials';
import NewsLetter from './NewsLetter';
import Remotehour from './Remotehour';

const WhoIsMaking = () => {
  return (
    <section id="who-is-making" className="bg-gray-100 py-16">
      <div className="w-11/12 md:w-7/12 lg:w-7/12 m-auto">
        <h2 className="font-bold text-3xl text-center mb-2 text-green-400">
          Who is making AskMakers?
        </h2>
        <p className="text-center mb-4 text-lg font-normal">
          Hi, I am Taishi👋, software developer based in Canada, Vancouver🇨🇦
          <br />I am making AskMakers because I want Quora for Indie Hackers.
          <br />
          Please connect on socials 👇
        </p>
        <Socials />
        <div className="flex justify-center mb-8">
          <img
            src="/taishi.png"
            className="w-24 h-24 rounded-full"
            alt="Taishi Kato's profile picture"
            title="Taishi Kato"
          />
        </div>
        <NewsLetter />
        <Remotehour />
      </div>
    </section>
  );
};

export default WhoIsMaking;
