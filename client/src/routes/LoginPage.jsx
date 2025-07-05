import { useState } from "react";
import { loginHandleChange } from "../utils/handleChange.js";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import { clearFlashMessage, setFlashMessage } from "../redux/flash/flashMessage.js";
import fetchData from "../utils/fetchData.js";
import Loader from "../helperComponents/Loader.jsx";
import { Link, useNavigate } from 'react-router-dom';
import googleAuth from "../utils/googleAuth.js";

import { Container, Row, Col, Form, Button, Image, Card } from "react-bootstrap";
import { FaEnvelope, FaLock, FaGoogle, FaArrowRight, FaUser } from "react-icons/fa";
import "animate.css";

export default function Login() {
  const [formData, setFormData] = useState(null);
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetchData("https://bank-website-23d3.vercel.app/api/login", formData, "LOGIN");
      const data = await res.json();
      if (res.status !== 200) {
        dispatch(signInError(data.message));
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      } else {
        dispatch(signInSuccess(data));
        dispatch(setFlashMessage({ message: "Welcome Back! Login successful!", type: "success" }));
        navigate('/profile');
      }
    } catch (err) {
      dispatch(signInError("Unexpected Error Occurred"));
      dispatch(setFlashMessage({ message: "Unexpected error occurred. Please try again.", type: "danger" }));
    }
  };

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const dat1 = await googleAuth();
      const formData = { token: dat1.token };
      const res = await fetchData("https://bank-website-23d3.vercel.app/api/login", formData, "LOGIN");
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
      dispatch(signInError("Unexpected Error Occurred"));
      dispatch(setFlashMessage({ message: "Unexpected error occurred. Please try again.", type: "danger" }));
    } finally {
      dispatch(clearFlashMessage());
    }
  };

  return (
    <>
      {userState.loading && <Loader props={"Logging In"} />}

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
                  <FaUser alt="login-logo" fluid style={{ maxHeight: "80px" }} />
                  <h2 className="mt-3 fw-bold">Welcome Back</h2>
                  <p className="text-muted">Login to your account</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="shadow-sm"
                      onChange={(e) => loginHandleChange(e, "gmail", setFormData, formData)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label><FaLock className="me-2" />Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="shadow-sm"
                      onChange={(e) => loginHandleChange(e, "password", setFormData, formData)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 d-flex justify-content-center align-items-center"
                  >
                    Login <FaArrowRight className="ms-2" />
                  </Button>

                  <Button
                    variant="outline-danger"
                    className="w-100 mt-3 d-flex justify-content-center align-items-center"
                    onClick={handleGoogleAuth}
                  >
                    <FaGoogle className="me-2" />
                    Login with Google
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/forgotpass" className="text-warning d-block mb-1">Forgot Password?</Link>
                  <Link to="/signup" className="text-info d-block">Don't have an account? Sign up</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
