import React from 'react';
import './Loader.css'; // Ensure the path is correct based on your project structure

const LoaderImg = () => {
  return (
    <div id='global-loader' className='main-content'>
      <div className='fullscreen'>
        <div>
          <span className='custom-spinner'></span>
        </div>
      </div>
    </div>
  );
};

export default LoaderImg;
