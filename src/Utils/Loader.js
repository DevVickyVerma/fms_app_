import './Loader.css'; // Ensure the path is correct

const LoaderImg = () => {
  return (
    <div id="global-loader" className="main-content">
      <div className="fullscreen">
        <div>
          <span className="custom-spinner" />
        </div>
      </div>
    </div>
  );
};

export default LoaderImg;
