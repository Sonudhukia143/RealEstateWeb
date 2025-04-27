import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import fetchData from "../utils/fetchData.js";
import Loader from "../helperComponents/Loader.jsx";
import { useNavigate } from 'react-router-dom';
import { signUpHandleChange } from "../utils/handleChange.js";
import { Link } from "react-router-dom";

export default function ChangePassword() {
    const [formData, setFormData] = useState(null);

    const userState = useSelector(state => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            const res = await fetchData("http://localhost:3000/api/change-pass", formData, "CHANGEPASS", userState.currentUser.token);
            const data = await res.json();
            console.log(data);
            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                navigate('/profile');
            }
        } catch (err) {
            dispatch(signInError("Unexpected Error Occured"));
            dispatch(setFlashMessage({ message: "Unexpected error occurred. Please try again.", type: "danger" }));
        }
    };

    return (
        <>
            {userState.loading && <Loader props={"Updating Password"} />}
            <div className="log-in-form-wrapper">
                <form className="log-in-form" onSubmit={handleSubmit}>
                    <h1>CHANGE PASSWORD</h1>
                    <div>
                        <span className="row mb-3">
                            <span className="row mb-3">
                                <label htmlFor="password" className="col-sm-12 col-form-label">
                                    New Password
                                </label>
                                <span className="col-sm-12">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        onChange={(e) => signUpHandleChange(e, "newPassword", setFormData, formData)}
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
                        </span>
                    </div>
                    <button type="submit" className="btn btn-primary">Confirm</button>
                    <button type="button" className="btn btn-danger mt-4"><Link to="/profile" className="text-white text-decoration-none">Cancel</Link></button>
                </form>
            </div>
        </>
    );
}