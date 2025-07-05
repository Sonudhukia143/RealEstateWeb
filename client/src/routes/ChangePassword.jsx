import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import { clearFlashMessage, setFlashMessage } from "../redux/flash/flashMessage.js";
import fetchData from "../utils/fetchData.js";
import Loader from "../helperComponents/Loader.jsx";
import { useNavigate, Link } from "react-router-dom";
import { signUpHandleChange } from "../utils/handleChange.js";

import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
} from "react-bootstrap";
import { FaLock, FaArrowRight } from "react-icons/fa";
import "animate.css";

export default function ChangePassword() {
    const [formData, setFormData] = useState({});
    const userState = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData?.newPassword !== formData?.confirmPassword) {
            dispatch(signInError("Passwords do not match"));
            dispatch(setFlashMessage({ message: "Passwords do not match", type: "error" }));
            return;
        }

        dispatch(signInStart());
        try {
            const res = await fetchData(
                "https://bank-website-23d3.vercel.app/api/change-pass",
                formData,
                "CHANGEPASS",
                userState.currentUser.token
            );
            const data = await res.json();

            if (res.status !== 200 || !res.ok) {
                dispatch(signInError(data.message));
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            } else {
                console.log(data);
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                dispatch(signInSuccess(data));
                navigate("/profile");
            }
        } catch (err) {
            dispatch(signInError("Unexpected Error Occurred"));
            dispatch(
                setFlashMessage({
                    message: "Unexpected error occurred. Please try again.",
                    type: "danger",
                })
            );
        }
    };

    return (
        <>
            {userState.loading && <Loader props={"Updating Password"} />}
            <Container
                fluid
                className="bg-light text-dark d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh", paddingTop: "6vh", paddingBottom: "6vh" }}
            >
                <Row className="w-100 justify-content-center">
                    <Col md={6} lg={5} xl={4}>
                        <Card className="p-4 shadow-lg border-0 rounded animate__animated animate__fadeInUp bg-white text-dark">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold">Change Password</h2>
                                    <p className="text-muted">Secure your account with a new password</p>
                                </div>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="newPassword">
                                        <Form.Label>
                                            <FaLock className="me-2" />
                                            New Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter new password"
                                            required
                                            onChange={(e) =>
                                                signUpHandleChange(e, "newPassword", setFormData, formData)
                                            }
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="confirmPassword">
                                        <Form.Label>
                                            <FaLock className="me-2" />
                                            Confirm Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm new password"
                                            required
                                            onChange={(e) =>
                                                signUpHandleChange(e, "confirmPassword", setFormData, formData)
                                            }
                                        />
                                    </Form.Group>

                                    {userState.error && (
                                        <div className="text-danger text-center mb-3 fw-semibold">
                                            {userState.error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-100 d-flex justify-content-center align-items-center"
                                    >
                                        Confirm <FaArrowRight className="ms-2" />
                                    </Button>

                                    <Link to="/profile">
                                        <Button
                                            type="button"
                                            variant="outline-danger"
                                            className="w-100 mt-3"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
