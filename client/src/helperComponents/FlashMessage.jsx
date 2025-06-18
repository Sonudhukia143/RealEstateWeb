import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useDispatch } from "react-redux";
import { clearFlashMessage } from "../redux/flash/flashMessage";

export default function FlashMessage({ message, duration = 3000, type = "info" }) {
    const [visible, setVisible] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            dispatch(clearFlashMessage());
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    const bgColor = type === "error" ? "danger" : type === "success" ? "success" : "warning";

    return (
        <Alert variant={bgColor} onClose={() => setVisible(false)} dismissible style={{position:"absolute",top:"12vh",width:"100%",zIndex:"99999"}}>
            <Alert.Heading>{type}!</Alert.Heading>
            <p>
                {message}
            </p>
        </Alert>
    );

}