import { Col,Card,Image,Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProfileInfo({ state}) {
    return (
        <Col md={4} className="text-center">
        <Card className="shadow-sm">
          <Card.Body>
            <Image
              src={state?.profile ? state?.profile : 'assets/profile.webp'}
              roundedCircle
              alt="Profile Picture"
              className="mb-3"
              style={{ width: '150px', height: '150px' }}
            />
            <Card.Title>{state?.username}</Card.Title>
            <Card.Text>{state?.gmail}</Card.Text>
            <Button variant="primary">
              <Link className="text-white text-decoration-none" to="/update-profile">
                Edit Profile
              </Link>
            </Button>
            <Button variant="primary m-2">
              <Link className="text-white text-decoration-none" to="/change-password">
                Change Password
              </Link>
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
}