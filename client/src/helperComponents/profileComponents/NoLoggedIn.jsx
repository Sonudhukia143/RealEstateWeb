import { Container,Card,Image } from 'react-bootstrap';
import {  NavLink } from 'react-router-dom';

export default function NoLoggedIn() {
    return (
        <Container className="mt-5 text-center">
            <Card className="shadow-sm">
                <Card.Body>
                    <Image
                        src="assets/profile.webp"
                        roundedCircle
                        alt="Profile Placeholder"
                        className="mb-3"
                        style={{ width: '150px', height: '150px' }}
                    />
                    <Card.Title>No user data available</Card.Title>
                    <Card.Text>Please log in to see your profile.</Card.Text>
                    <NavLink to="/login">
                        <Button variant="primary">Login</Button>
                    </NavLink>
                </Card.Body>
            </Card>
        </Container>
    );
}