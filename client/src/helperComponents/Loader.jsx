import '../../styles/loader.css';

export default function Loader({ props }) {
  return (
    <div className="custom-loader-overlay">
      <div className="custom-loader-content">
        <div className="spinner-border text-light spinner-lg" role="status"></div>
        <h5 className="mt-3 text-light glowing-text">
          {props ? props : "Loading..."}
        </h5>
      </div>
    </div>
  );
}
