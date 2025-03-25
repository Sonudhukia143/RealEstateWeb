import { useState } from "react"
import { loginHandleChange } from "../utils/handleChange.js";
import {useDispatch, useSelector} from "react-redux";
import { signInStart,signInError,signInSuccess } from "../redux/user/userSlice.js";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import fetchData from "../utils/fetchData.js";
import Loader from "../helperComponents/Loader.jsx";
import {useNavigate} from 'react-router-dom';
import FlashMessage from "../helperComponents/FlashMessage.jsx";
import googleAuth from "../utils/googleAuth.js";

export default function Login() {
    const [formData,setFormData] = useState(null);

    const userState = useSelector(state => state.user);

    const flashMessage = useSelector(state => state.flash);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try{
            const res = await fetchData("https://bank-website-23d3.vercel.app/api/login",formData,"LOGIN");
            const data = await res.json();
            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                dispatch(signInSuccess(data));
                dispatch(setFlashMessage({ message: "Welcome Back! Login successful!", type: "success" }));
                navigate('/');
            }    
        }catch(err){
            dispatch(signInError("Unexpected Error Occured"));
            dispatch(setFlashMessage({ message: "Unexpected error occurred. Please try again.", type: "danger" }));
        }
    };

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        dispatch(signInStart());

        try{
            const dat1 = await googleAuth();
            console.log(dat1);
            const formData = {
                token: dat1.token,
            };    
            console.log(formData);
            const res = await fetchData("/api/login",formData,"LOGIN");
            console.log(res);
            const data = await res.json();
            console.log(data);
            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                dispatch(signInSuccess(data));
                dispatch(setFlashMessage({ message: "Welcome Back! Login successful!", type: "success" }));
                navigate('/');
            }    
        }catch(err){
            dispatch(signInError("Unexpected Error Occured"));
            dispatch(setFlashMessage({ message: "Unexpected error occurred. Please try again.", type: "danger" }));
            console.log(err);
        }
    }

    return (
        <>
        {flashMessage?.message && <FlashMessage message={flashMessage.message} type={flashMessage.type}/>}
        {userState.loading && <Loader props={"Logging In"} />}
            <div className="log-in-form-wrapper">
                <form className="log-in-form" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <br/>
                    <span className="login-image">
                        <img src="/assets/loginlogo.webp" className="login-image" loading="lazy"/>
                    </span>
                    <br/>
                    <div>
                    <span className="row mb-3">
                        <label htmlFor="email" className="col-sm-12 col-form-label">Email</label>
                        <span className="col-sm-12">
                            <input type="email" className="form-control" id="email" required onChange={(e) => loginHandleChange(e,"gmail",setFormData,formData)}/>
                        </span>
                    </span>
                    <span className="row mb-3">
                        <label htmlFor="password" className="col-sm-12 col-form-label">Password</label>
                        <span className="col-sm-12">
                            <input type="password" className="form-control" id="password" required onChange={(e) => loginHandleChange(e,"password",setFormData,formData)}/>
                        </span>
                    </span>
                    </div>
                    <button type="submit" className="btn btn-primary">LOG IN</button>
                    <button type="button" className="btn btn-danger mt-4" onClick={handleGoogleAuth}>Google LogIn</button>
                </form>
            </div>
        </>
    );
}