import React from 'react';

const Card = ({ children, header = '' }) => {
  return (
    <>
      <div className="card-container border rounded pb-4 mb-5">
        <div className="card-header text-center font-semibold border-b p-2 mb-2">
          {header}
        </div>
        <div className="px-4">{children}</div>
      </div>
      <style jsx>{`
        .card-container {
          border-color: #dddddd;
        }
        .card-header {
          background-color: #f5f5f5;
          border-color: #dddddd;
        }
      `}</style>
    </>
  );
};

export default Card;
