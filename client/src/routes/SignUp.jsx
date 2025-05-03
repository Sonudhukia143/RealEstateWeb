import { useState } from "react";
import { signUpHandleChange } from "../utils/handleChange.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../helperComponents/Loader.jsx";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import fetchData from "../utils/fetchData.js";
import { Link, useNavigate } from "react-router-dom";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import googleAuth from "../utils/googleAuth.js";

export default function SignUp() {
    const [formData, setFormData] = useState({ img: "/assets/profile.webp" });

    const userState = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData?.password !== formData?.confirmPassword && dispatch(signInError("Passwords do not match"));
        dispatch(signInStart());

        try {
            const res = await fetchData("/api/signin", formData, "SIGNIN");
            const data = await res.json();
            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                dispatch(signInSuccess(data));
                dispatch(setFlashMessage({ message: "Welcome Back! Login successful!", type: "success" }));
                navigate('/');
            }
        } catch (err) {
            dispatch(signInError("Unexpected Error Occured"));
            dispatch(setFlashMessage({ message: err.message, type: "error" }));
        }
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        
        try {
            const formData = await googleAuth();
            if(!formData) dispatch(signInError("Google Verification Unsuccessfully"));

            const res = await fetchData("/api/signin", formData, "SIGNIN");

            const data = await res.json();
            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                dispatch(signInSuccess(data));
                dispatch(setFlashMessage({ message: "Welcome Back! Login successful!", type: "success" }));
                navigate('/');
            }
        } catch (err) {
            dispatch(signInError("Unexpected Error Occured"));
            dispatch(setFlashMessage({ message: "Unexpected server error occured!", type: "error" }));
        }
    };

    return (
        <>
            {userState.loading && <Loader props={"Signing In"} />}
            <div className="log-in-form-wrapper">
                <form className="log-in-form" onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <div>
                        <label htmlFor="profile-image-upload" className="profile-image-container">
                            <img
                                id="profile-image-preview"
                                src={formData.previewUrl ? formData.previewUrl : formData.img}
                                alt="Profile Image Preview"
                                loading="lazy"
                            />
                            <input
                                type="file"
                                id="profile-image-upload"
                                accept="image/*"
                                name="img"
                                onChange={(e) => signUpHandleChange(e, "img", setFormData, formData)}
                            />
                        </label>

                        <span className="row mb-3">
                            <label htmlFor="username" className="col-sm-12 col-form-label">
                                Username
                            </label>
                            <span className="col-sm-12">
                                <input type="text" className="form-control" id="username" required onChange={(e) => signUpHandleChange(e, "username", setFormData, formData)} />
                            </span>
                        </span>
                        <span className="row mb-3">
                            <label htmlFor="email" className="col-sm-12 col-form-label">
                                Email
                            </label>
                            <span className="col-sm-12">
                                <input type="email" className="form-control" id="email" required onChange={(e) => signUpHandleChange(e, "gmail", setFormData, formData)} />
                            </span>
                        </span>
                        <span className="row mb-3">
                            <label htmlFor="password" className="col-sm-12 col-form-label">
                                Password
                            </label>
                            <span className="col-sm-12">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    onChange={(e) => signUpHandleChange(e, "password", setFormData, formData)}
                                    required
                                />
                            </span>
                        </span>
                        <span className="row mb-3">
                            <label htmlFor="confirmpassword" className="col-sm-12 col-form-label">
                                Confirm Password
                            </label>
                            <span className="col-sm-12">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmpassword"
                                    onChange={(e) => signUpHandleChange(e, "confirmPassword", setFormData, formData)}
                                    required
                                />
                            </span>
                        </span>
                    </div>
                    {userState.error && <div style={{ color: "red" }}>{userState.error}</div>}
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                    <button type="button" className="btn btn-danger mt-4" onClick={handleGoogleAuth}>Google Sign In</button>
                    <p className="col-md mt-2"><Link to='/login'>Already a user? LOGIN!</Link></p>
                </form>
            </div>
        </>
    );
}
