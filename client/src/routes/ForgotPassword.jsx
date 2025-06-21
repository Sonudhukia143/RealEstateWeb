import { useState } from "react";
import "../../styles/forms.css"
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
        if (otp) return;
        else setEmail(e.target.value);
    }

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
            } else if (!res.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            }
        } catch (err) {
            dispatch(setFlashMessage({ message: err.message, type: "error" }))
        }finally{
            setLoading(false);
        }
    }

    const submitOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://bank-website-23d3.vercel.app/api/verify-otp', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ gmail: email, otpVal: otpVal })
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                dispatch(signInSuccess(data));
                navigate('/');
            } else if (!res.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            }
        } catch (err) {
            dispatch(setFlashMessage({ message: err.message, type: "error" }));
        }finally{
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
        <div className="log-in-form-wrapper mt-4 passresetform">
            <div className="log-in-form passresetform">
                <h1>Login Using OTP</h1>
                <span className="row mb-3">
                    <label htmlFor="email" className="col-sm-12 col-form-label">Email</label>
                    <span className="col-sm-12">
                        <input type="email" className={otp ? "disabled form-control" : "form-control"} id="email" disabled={otp || loading} required onChange={(e) => gmailVerification(e)} />
                    </span>
                </span>
                {
                    !otp && <button type="button" onClick={sendOtp} className={loading ? "btn btn-primary disabled" : "btn btn-primary"}>{loading?"Sending OTP":"GET OTP"}</button>
                }
                {
                    otp
                        ?
                        <>
                            <div className="container mt-4 passresetform">
                                <h5>Enter OTP</h5>
                                <div className="d-flex justify-content-center gap-2 gap-md-2 gap-lg-4">
                                    {otpVal.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            className="form-control text-center otp-input"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button type="button" onClick={submitOtp} className={loading?"btn btn-primary mt-2 disabled":"btn btn-primary mt-2"}>{loading?"Logging In":"Login"}</button></>
                        :
                        ""
                }
            </div>
        </div>
    )
}