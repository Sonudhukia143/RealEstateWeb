import { useState } from "react";
import { signUpHandleChange } from "../utils/handleChange.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../helperComponents/Loader.jsx";
import { signInStart, signInError, signInSuccess } from "../redux/user/userSlice.js";
import fetchData from "../utils/fetchData.js";
import { Link, useNavigate } from "react-router-dom";
import { setFlashMessage } from "../redux/flash/flashMessage.js";

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
  FaUserEdit,
  FaArrowRight,
  FaImage,
} from "react-icons/fa";
import "animate.css";

export default function UpdateProfile() {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: userState?.currentUser?.user?.username || "",
    img: userState?.currentUser?.user?.profile || "/assets/profile.webp",
    previewUrl: userState?.currentUser?.user?.profile || "/assets/profile.webp",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetchData(
        "https://bank-website-23d3.vercel.app/api/update-profile",
        formData,
        "UPDATE",
        userState.currentUser.token
      );
      const data = await res.json();

      if (res.status !== 200 || !res.ok) {
        dispatch(signInError(data.message));
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      } else {
        dispatch(signInSuccess(data));
        dispatch(setFlashMessage({ message: data.message, type: "success" }));
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
      dispatch(signInError("Unexpected Error Occurred"));
      dispatch(setFlashMessage({ message: err.message, type: "error" }));
    }
  };

  return (
    <>
      {userState.loading && <Loader props={"Updating Profile"} />}
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
                  <FaUserEdit
                    alt="update-logo"
                    fluid
                    style={{ maxHeight: "80px" }}
                  />
                  <h2 className="mt-3 fw-bold">Update Profile</h2>
                  <p className="text-muted">Modify your info below</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Profile Picture Upload */}
                  <Form.Group className="mb-3 text-center">
                    <Form.Label htmlFor="profile-image-upload" className="d-block mb-2">
                      <FaImage className="me-2" />
                      Profile Image
                    </Form.Label>
                    <label htmlFor="profile-image-upload">
                      <Image
                        src={formData.previewUrl}
                        roundedCircle
                        className="hover-shadow"
                        style={{
                          height: "90px",
                          width: "90px",
                          objectFit: "cover",
                          border: "2px solid #ccc",
                          cursor: "pointer",
                        }}
                      />
                    </label>
                    <Form.Control
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        signUpHandleChange(e, "img", setFormData, formData)
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>
                      <FaUserEdit className="me-2" />
                      New Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      required
                      placeholder="Enter new username"
                      onChange={(e) =>
                        signUpHandleChange(e, "username", setFormData, formData)
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
                    Save Changes <FaArrowRight className="ms-2" />
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
