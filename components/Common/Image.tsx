import React from 'react';

interface Iprops {
  image: string;
  alt: string;
}

const Image: React.FC<Iprops> = ({ image, alt = '' }) => {
  return (
    <>
      <img src={image} alt={alt} className="border w-8 h-8 rounded-full" />
      <style jsx>{`
        img {
          border-color: #dddddd;
        }
      `}</style>
    </>
  );
};

export default Image;
