import React from 'react';

const NotFound = () => {
  return (
    <div className="flex justify-center mt-8">
      <div className="text-center">
        <img src="/not-found.svg" width="500" alt="404 page not found" />
        <p className="font-light">
          This page may have been deleted by the user.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
