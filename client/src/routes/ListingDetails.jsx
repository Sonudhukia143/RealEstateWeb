import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container, Row, Col, Image, Card, Badge,
    Spinner, Alert, Form, Button
} from 'react-bootstrap';
import fetchData from '../utils/fetchData';
import { useDispatch, useSelector } from 'react-redux';
import fetchMap from '../utils/fetchMap';
import getDistanceFromLatLonInKm from '../utils/distanceCalculator';
import { setFlashMessage } from '../redux/flash/flashMessage';
import ListingCard from '../helperComponents/ListingCard';

export default function ListingDetails() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [listingLocation, setListingLocation] = useState(null);
    const dispatch = useDispatch();

    const user = useSelector(state => state.user);
    const token = user?.currentUser?.token;
    const userLoc = user?.currentUser?.location;
    const userEmail = user?.currentUser?.user?.gmail;

    const [messageSent, setMessageSent] = useState(false);

    const onDelete = (id) => {
        console.log(`Delete listing with ID: ${id}`);
    }

    // Distance calculation (based on coordinates after geolocation fetch)
    const distance = (userLoc && listingLocation)
        ? getDistanceFromLatLonInKm(userLoc.lat, userLoc.lon, listingLocation.lat, listingLocation.lon)
        : null;

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetchData(`https://bank-website-23d3.vercel.app/api/get-listing/${id}`, null, 'GETLISTING', token);
                const data = await res.json();
                if (res.ok) {
                    setListing(data);
                } else {
                    setError(data.message || 'Failed to load listing');
                }
            } catch (err) {
                setError('Server error. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id, token]);

    // Get Lat/Lon from address
    useEffect(() => {
        const fetchGeoLocation = async () => {
            if (!listing) return;
            const { city, state, country, pincode } = listing?.address || {};
            if (city && state && country && pincode) {
                try {
                    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?postcode=${pincode}&city=${city}&state=${state}&country=${country}&format=json&apiKey=${import.meta.env.VITE_GEOLOCATION_API_KEY}`);
                    const data = await response.json();

                    if (data?.results?.[0]?.lat && data?.results?.[0]?.lon) {
                        const location = {
                            lat: data.results[0].lat,
                            lon: data.results[0].lon
                        };
                        setListingLocation(location);
                        fetchMap(location); // show map once coordinates are ready
                    } else {
                        dispatch(setFlashMessage({ message: "Enter a valid location to get on map", type: "error" }));
                    }
                } catch (error) {
                    dispatch(setFlashMessage({ message: "Geolocation error", type: "error" }));
                }
            }
        };

        fetchGeoLocation();
    }, [listing]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        setMessageSent(true);
        dispatch(setFlashMessage({ message: "Message sent to the owner!", type: "success" }));

        // You can also trigger a real API to send the message here.
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4 p-4">
            {/* Hero Image */}
            {/* Title & Pricing */}
            <Card className="mb-4 p-3 shadow">
                <Card.Body>
                    <h2>{listing.name}</h2>
                    <Badge bg={listing.type === 'rent' ? 'success' : 'primary'} className="me-2">
                        {listing.type.toUpperCase()}
                    </Badge>
                </Card.Body>
            </Card>

            {listing.imageUrls?.[0] && (
                <Image src={listing.imageUrls[0]} fluid className="mb-4 rounded hero-img" />
            )}


            <Card className="mb-4 p-3 shadow">
                <Card.Body>
                    <h4 className="mt-3">
                        ${listing.offer ? listing.discountPrice : listing.regularPrice}
                        {listing.type === 'rent' && <small> / month</small>}
                    </h4>
                    <p className="text-muted">
                        {listing.address.city}, {listing.address.state}, {listing.address.country} - {listing.address.pincode}
                    </p>
                </Card.Body>
            </Card>


            {/* Features */}
            <Row className="text-center mb-4">
                <Col><i className="fa fa-bed"></i> {listing.bedrooms} Beds</Col>
                <Col><i className="fa fa-bath"></i> {listing.bathrooms} Baths</Col>
                <Col><i className="fa fa-car"></i> {listing.parking ? 'Parking' : 'No Parking'}</Col>
                <Col><i className="fa fa-couch"></i> {listing.furnished ? 'Furnished' : 'Unfurnished'}</Col>
                <Col>
                    {
                        listing?.offer ? (
                            <>
                                <Badge bg="success">Offer</Badge>{" "}
                                <strong className="text-danger">₹{listing?.discountPrice}</strong>
                                <span className="text-muted text-decoration-line-through ms-1">
                                    ₹{listing?.regularPrice}
                                </span>
                            </>
                        ) : (
                            <strong>₹{listing?.regularPrice}</strong>
                        )
                    }
                    {listing?.type === "rent" && <span className="ms-1 text-muted">/ month</span>}</Col>
            </Row>

            {/* Description */}
            <Card className="mb-4 p-3">
                <h4>Description</h4>
                <p>{listing.description}</p>
            </Card>

            {/* Image Gallery */}
            <Row className="mb-4">
                {listing.imageUrls.slice(1).map((url, idx) => (
                    <Col md={4} sm={6} xs={12} key={idx} className="mb-3">
                        <Image src={url} thumbnail className="w-100 rounded" />
                    </Col>
                ))}
            </Row>

            {/* Map */}
            <div id="map" style={{ width: "80%", height: "40vh", margin: "5vh auto" }} className="col-6 rounded border"></div>

            {/* Distance from User */}
            {
                userLoc && distance !== null && (
                    <Card className="mb-4 p-3">
                        <h5>Distance from your current location</h5>
                        <p className="mb-0">{distance.toFixed(2)} km</p>
                    </Card>
                )
            }

            {/* Owner Contact Info */}
            {
                listing.ownerGmail && (
                    <Card className="mb-4 p-3">
                        <h5>Owner Contact</h5>
                        <p>Email: <a href={`mailto:${listing.ownerGmail}`}>{listing.ownerGmail}</a></p>
                        <p>👆 Click On The Email To Send Personal Message.</p>
                    </Card>
                )
            }

            {/* Contact Form */}
            {
                listing.ownerGmail && userEmail && (
                    <Card className="mb-6 p-3">
                        <h5>Send Message to Owner</h5>
                        <Form onSubmit={handleSendMessage}>
                            <Form.Group className="col-9 col-md-6 col-sm-3">
                                <Form.Label>Your Email</Form.Label>
                                <Form.Control type="email" value={userEmail} readOnly />
                            </Form.Group>
                            <Form.Group className="col-9 col-md-6 col-sm-3">
                                <Form.Label>Owner Email</Form.Label>
                                <Form.Control type="email" value={listing.ownerGmail} readOnly />
                            </Form.Group>
                            <Form.Group className="col-9 col-md-6 col-sm-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    defaultValue={`Hi, I'm interested in your property "${listing.name}" listed on our platform. Please contact me back. Thank you!`}
                                    readOnly
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" disabled={messageSent}>
                                {messageSent ? 'Message Sent' : 'Send Message'}
                            </Button>
                        </Form>
                    </Card>
                )
            }
        </Container >
    );
}
