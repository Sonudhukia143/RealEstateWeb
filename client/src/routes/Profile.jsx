import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export default function Profile() {
  const state = useSelector(state => state.user?.currentUser?.user);

  const user = {
    phone: '+123 456 7890',
    location: 'New York, USA',
  };

  return (
    <>
    {
        state
        ?
        <Container className="mt-5">
        <Row>
          <Col md={4} className="text-center">
            <Card className="shadow-sm">
              <Card.Body>
                <Image
                  src={state?.profile?state?.profile:'assets/profile.webp'}
                  roundedCircle
                  alt="Profile Picture"
                  className="mb-3"
                  style={{ width: '150px', height: '150px' }}
                />
                <Card.Title>{state?.username}</Card.Title>
                <Card.Text>{state?.gmail}</Card.Text>
                <Button variant="primary">Edit Profile</Button>
              </Card.Body>
            </Card>
          </Col>
  
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Contact Information</Card.Title>
                <Row>
                  <Col md={6}>
                    <h6>Email</h6>
                    <p>{user.email}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Phone</h6>
                    <p>{user.phone}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <h6>Location</h6>
                    <p>{user.location}</p>
                  </Col>
                </Row>
                <Button variant="outline-primary">Update Info</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      :
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
          <NavLink to="/login"><Button variant="primary">Login</Button></NavLink>
        </Card.Body>
      </Card>
    </Container>
    }
    </>
  );
}