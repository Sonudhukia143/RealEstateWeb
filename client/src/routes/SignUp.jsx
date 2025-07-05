import { useState } from "react";
import { signUpHandleChange } from "../utils/handleChange.js";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import fetchData from "../utils/fetchData.js";
import { Link, useNavigate } from "react-router-dom";
import googleAuth from "../utils/googleAuth.js";
import Loader from "../helperComponents/Loader.jsx";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaUser,
  FaArrowRight,
  FaImage,
} from "react-icons/fa";
import "animate.css";

export default function SignUp() {
  const [formData, setFormData] = useState({ img: "/assets/profile.webp" });

  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData?.password !== formData?.confirmPassword) {
      dispatch(signInError("Passwords do not match"));
      return;
    }

    dispatch(signInStart());
    try {
      const res = await fetchData(
        "https://bank-website-23d3.vercel.app/api/signin",
        formData,
        "SIGNIN"
      );
      const data = await res.json();
      if (res.status !== 200 || !res.ok) {
        dispatch(signInError(data.message));
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      } else {
        dispatch(signInSuccess(data));
        dispatch(setFlashMessage({ message: "Signup successful!", type: "success" }));
        navigate("/profile");
      }
    } catch (err) {
      dispatch(signInError("Unexpected Error Occurred"));
      dispatch(setFlashMessage({ message: err.message, type: "error" }));
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const googleData = await googleAuth();
      if (!googleData) {
        dispatch(signInError("Google Verification Unsuccessful"));
        return;
      }

      const res = await fetchData(
        "https://bank-website-23d3.vercel.app/api/signin",
        googleData,
        "SIGNIN"
      );
      const data = await res.json();

      if (res.status !== 200 || !res.ok) {
        dispatch(signInError(data.message));
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      } else {
        dispatch(signInSuccess(data));
        dispatch(setFlashMessage({ message: "Signup via Google successful!", type: "success" }));
        navigate("/profile");
      }
    } catch (err) {
      dispatch(signInError("Unexpected Error Occurred"));
      dispatch(setFlashMessage({ message: "Unexpected server error occurred!", type: "error" }));
    }
  };

  return (
    <>
      {userState.loading && <Loader props={"Signing Up"} />}
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
                  <FaUser
                    alt="signup-logo"
                    fluid
                    style={{ maxHeight: "80px" }}
                  />
                  <h2 className="mt-3 fw-bold">Create Account</h2>
                  <p className="text-muted">Sign up to get started</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Profile Image Upload */}
                  <Form.Group className="mb-3 text-center">
                    <Form.Label htmlFor="profile-image-upload" className="d-block mb-2">
                      <FaImage className="me-2" />
                      Profile Image
                    </Form.Label>
                    <label htmlFor="profile-image-upload" className="d-inline-block cursor-pointer">
                      <Image
                        src={formData.previewUrl || formData.img}
                        roundedCircle
                        className="hover-shadow"
                        style={{
                          height: "90px",
                          width: "90px",
                          objectFit: "cover",
                          border: "2px solid #ccc",
                          cursor: "pointer",
                          transition: "transform 0.2s ease-in-out",
                        }}
                      />
                    </label>
                    <Form.Control
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => signUpHandleChange(e, "img", setFormData, formData)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label><FaUser className="me-2" />Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      required
                      onChange={(e) => signUpHandleChange(e, "username", setFormData, formData)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      required
                      onChange={(e) => signUpHandleChange(e, "gmail", setFormData, formData)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label><FaLock className="me-2" />Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      required
                      onChange={(e) => signUpHandleChange(e, "password", setFormData, formData)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label><FaLock className="me-2" />Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Re-enter your password"
                      required
                      onChange={(e) => signUpHandleChange(e, "confirmPassword", setFormData, formData)}
                    />
                  </Form.Group>

                  {userState.error && (
                    <div className="text-danger text-center mb-3 fw-semibold">
                      {userState.error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 d-flex justify-content-center align-items-center"
                  >
                    Sign Up <FaArrowRight className="ms-2" />
                  </Button>

                  <Button
                    variant="outline-danger"
                    className="w-100 mt-3 d-flex justify-content-center align-items-center"
                    onClick={handleGoogleAuth}
                  >
                    <FaGoogle className="me-2" />
                    Sign up with Google
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/login" className="text-info">
                    Already have an account? Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
