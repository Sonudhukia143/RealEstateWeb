import '../../styles/loader.css';

export default function Loader({ props }) {
    return (
        <>
            <div className="overlay">
            <button id="loader" className="btn btn-primary spinner" type="button" disabled>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status"><h5> {props?props:"Loading..."} </h5></span>
            </button>
            </div>
        </>
    );

}