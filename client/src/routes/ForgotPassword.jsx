import { useState } from "react";
import "../../styles/forms.css";
import { useDispatch } from "react-redux";
import { setFlashMessage } from "../redux/flash/flashMessage";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [otp, sentOtp] = useState(false);
    const [email, setEmail] = useState(null);
    const [otpVal, setOtpVal] = useState(["", "", "", ""]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const gmailVerification = (e) => {
        if (!otp) setEmail(e.target.value);
    };

    const sendOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://bank-website-23d3.vercel.app/api/send-otp', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ gmail: email }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                sentOtp(true);
            } else {
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            }
        } catch (err) {
            dispatch(setFlashMessage({ message: err.message, type: "error" }));
        } finally {
            setLoading(false);
        }
    };

    const submitOtp = async () => {
        if (otpVal.includes("") || otpVal.includes("")) {
            dispatch(setFlashMessage({ message: data.message, type: "success" }));
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('https://bank-website-23d3.vercel.app/api/verify-otp', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ gmail: email, otpVal }),
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            }
        } catch (err) {
            dispatch(setFlashMessage({ message: err.message, type: "error" }));
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const updatedOtp = [...otpVal];
        updatedOtp[index] = value;
        setOtpVal(updatedOtp);
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light text-dark">
            <div className="p-4 rounded shadow bg-white" style={{ maxWidth: "450px", width: "100%" }}>
                <h2 className="text-center mb-4">Login Using OTP</h2>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                        type="email"
                        className={`form-control ${otp ? "disabled" : ""}`}
                        id="email"
                        disabled={otp || loading}
                        required
                        onChange={gmailVerification}
                        placeholder="Enter your email"
                    />
                </div>

                {!otp && (
                    <button
                        type="button"
                        onClick={sendOtp}
                        className={`btn btn-primary w-100 ${loading ? "disabled" : ""}`}
                    >
                        {loading ? "Sending OTP..." : "Get OTP"}
                    </button>
                )}

                {otp && (
                    <>
                        <div className="text-center mt-4">
                            <h5>Enter OTP</h5>
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                {otpVal.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        className="form-control text-center"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        style={{ width: "50px", fontSize: "1.25rem" }}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={submitOtp}
                            className={`btn btn-success w-100 mt-4 ${loading ? "disabled" : ""}`}
                        >
                            {loading ? "Logging In..." : "Login"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
