import { Card, ListGroup } from "react-bootstrap";
import { FaMapMarkerAlt, FaGlobe, FaCity, FaLocationArrow, FaUserShield } from "react-icons/fa";
import "animate.css";

export default function UserInfo({ userInfo }) {
    return (
        <>
            {userInfo && (
                <Card className="shadow-sm mt-4 animate__animated animate__fadeIn bg-light border-0">
                    <Card.Header className="bg-white fw-bold text-primary fs-6">
                        <FaUserShield className="me-2" />
                        Additional Information
                    </Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <FaLocationArrow className="me-2 text-secondary" />
                            <strong>Pincode:</strong> {userInfo?.pincode}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FaGlobe className="me-2 text-secondary" />
                            <strong>Country:</strong> {userInfo?.country}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FaMapMarkerAlt className="me-2 text-secondary" />
                            <strong>State:</strong> {userInfo?.state}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FaCity className="me-2 text-secondary" />
                            <strong>City:</strong> {userInfo?.city}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <FaUserShield className="me-2 text-secondary" />
                            <strong>User Type:</strong> {userInfo?.UserType}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            )}
        </>
    );
}
