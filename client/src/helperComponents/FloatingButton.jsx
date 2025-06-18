// src/components/FloatingBackButton.jsx
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { goBackRoute } from "../redux/route/routeHistorySlice.js";
import "../../styles/floatingbutton.css";
import { useState } from "react";

export default function FloatingBackButton() {
    const history = useSelector((state) => state.routeHistory.history);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [animationTime,setAnimationTime] = useState(true);

    setTimeout(() => {
        setAnimationTime(false);
    },2500);

    const handleBack = () => {
        if (history.length > 1) {
            dispatch(goBackRoute());
            const previousRoute = history[history.length - 2]; // second last
            navigate(previousRoute);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`floating-back-btn ${history.length <= 1 && !animationTime? "disabled" : ""}`}
            title="Go Back"
            id="button"
        >
            <span className="circle-icon button-text">{animationTime?<p style={{fontFamily:"serif",fontWeight:"100"}}>CLICK ME TO GO BACK</p>:"↶"}</span>
        </button>
    );
}
