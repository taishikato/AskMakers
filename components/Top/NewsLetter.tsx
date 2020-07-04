import React from 'react';

const NewsLetter = () => (
  <>
    <div className="mb-3 font-semibold text-2xl text-center">
      Weekly newsletter
    </div>
    <p className="text-center mb-4 text-lg font-normal">
      I write about what I have done, the problem I have, what I overcame in
      developing AskMakers, and what I will do in the future.
      <br />I also write a little bit about my tumultuous life after quitting my
      job in Japan and changing countries for about a year.
    </p>
    <div className="flex justify-center">
      <iframe
        src="https://taishi.substack.com/embed"
        width="480"
        height="320"
        style={{ border: '1px solid #EEE', background: 'white' }}
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  </>
);

export default NewsLetter;
