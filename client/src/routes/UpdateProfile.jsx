import { useState } from "react";
import { signUpHandleChange } from "../utils/handleChange.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../helperComponents/Loader.jsx";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import fetchData from "../utils/fetchData.js";
import { Link, useNavigate } from "react-router-dom";
import { setFlashMessage } from "../redux/flash/flashMessage.js";

export default function UpdateProfile () {
    const userState = useSelector(state => state.user);
    const [formData, setFormData] = useState({username: userState?.currentUser?.user?.username, img: userState?.currentUser?.user?.profile, previewUrl: userState?.currentUser?.user?.profile});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData?.password !== formData?.confirmPassword && dispatch(signInError("Passwords do not match"));
        dispatch(signInStart());

        try {
            const res = await fetchData("http://localhost:3000/api/update-profile", formData, "UPDATE",userState.currentUser.token);
            const data = await res.json();
            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                dispatch(signInSuccess(data));
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                navigate('/profile');
            }
        } catch (err) {
            console.log(err);
            dispatch(signInError("Unexpected Error Occured"));
            dispatch(setFlashMessage({ message: err.message, type: "error" }));
        }
    };

    return (
        <>
            {userState.loading && <Loader props={"Updating Proile"} />}
            <div className="log-in-form-wrapper">
                <form className="log-in-form" onSubmit={handleSubmit}>
                    <h1>Update Profile</h1>
                    <div>
                        <label htmlFor="profile-image-upload" className="profile-image-container">
                            <img
                                id="profile-image-preview"
                                src={!formData?.img ? userState?.currentUser?.user?.profile : formData.previewUrl}
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
                                New Username
                            </label>
                            <span className="col-sm-12">
                                <input type="text" value={formData.username} className="form-control" id="username" required onChange={(e) => signUpHandleChange(e, "username", setFormData, formData)} />
                            </span>
                        </span>
                    </div>
                    {userState.error && <div style={{ color: "red" }}>{userState.error}</div>}
                    <button type="submit" className="btn btn-primary" onClick={(e) => handleSubmit(e)}>Save Changes</button>
                    <button type="button" className="btn btn-danger mt-4"><Link to="/profile" className="text-white text-decoration-none">Cancel</Link></button>
                </form>
            </div>
        </>
    );
}
