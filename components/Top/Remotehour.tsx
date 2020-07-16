import React from 'react';

const Remotehour = () => {
  return (
    <div className="mt-8">
      <div className="mb-3 font-semibold text-2xl text-center">Let's talk!</div>
      <p className="text-center mb-4 text-lg font-normal">
        About AskMakers and anything!
      </p>
      <div className="flex justify-center">
        <iframe
          src="https://remotehour.com/widget/JnvgXnOLF0NvuYHSQFcmc4t072Y2?inline=true"
          width="480"
          height="320"
          marginWidth={0}
          marginHeight={0}
          frameBorder={0}
          style={{ border: 'none' }}
          allow="microphone; camera"
        ></iframe>
      </div>
    </div>
  );
};

export default Remotehour;
