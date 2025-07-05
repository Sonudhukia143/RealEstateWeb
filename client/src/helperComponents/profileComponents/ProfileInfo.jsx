import { Col, Card, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserEdit, FaKey } from "react-icons/fa";
import "animate.css";
import "../../../styles/profile.css";

export default function ProfileInfo({ props }) {
  const { state, loading } = props;

  return (
    <Col
      md={4}
      className="text-center d-flex align-items-center justify-content-center"
    >
      <Card className="shadow-lg border-0 rounded animate__animated animate__fadeInUp bg-white w-100">
        <Card.Body>
          <Image
            src={state?.profile ? state.profile : "/assets/profile.webp"}
            roundedCircle
            alt="Profile"
            className="mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <Card.Title className="fs-4 fw-bold">{state?.username}</Card.Title>
          <Card.Text className="text-muted mb-4">{state?.gmail}</Card.Text>

          <div className="d-grid gap-2">
            <Link to="/update-profile" className="text-decoration-none">
              <Button
                variant="outline-primary"
                className="d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                <FaUserEdit className="me-2" />
                Edit Profile
              </Button>
            </Link>

            <Link to="/change-password" className="text-decoration-none">
              <Button
                variant="outline-secondary"
                className="d-flex align-items-center justify-content-center"
                disabled={loading}
              >
                <FaKey className="me-2" />
                Change Password
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
