import React from 'react';
import Navbar from './Navbar';

const Layout = (props) => {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
};

export default Layout;
