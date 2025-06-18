import { Card, Badge, Row, Col, Button } from "react-bootstrap";
import {
    BsClock,
    BsFillCheckCircleFill,
    BsXCircleFill,
    BsFillPersonFill,
    BsFillEnvelopeFill,
    BsFillGeoAltFill,
    BsFillHouseFill,
} from "react-icons/bs";
import { FaBath, FaBed } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/box.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import fetchData from "../utils/fetchData";
import { setFlashMessage } from "../redux/flash/flashMessage";
import { deleteInitialListingById } from "../redux/listing/listingAdded";

export default function Box({ listing }) {
    const [loading, setLoading] = useState(false);
    const state = useSelector((state) => state?.user?.currentUser?.user);
    const token = useSelector((state) => state?.user?.currentUser?.token);
    const userGmail = state?.gmail;
    const dispatch = useDispatch();
    const {
        _id,
        name,
        imageUrls,
        address,
        description,
        regularPrice,
        discountPrice,
        discountedPrice,
        createdAt,
        bathrooms,
        bedrooms,
        furnished,
        parking,
        ownerName,
        ownerGmail,
    } = listing;

    const onDelete = async (id) => {
        try {
            setLoading(true);

            const res = await fetchData(`/api/delete-listing/${id}`, null, "DELETELISTING", token);
            const data = await res.json();

            if (res.status === 200 || res.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                dispatch(deleteInitialListingById({ _id }));
            } else {
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            }
        } catch (error) {
            dispatch(setFlashMessage({ message: "Error deleting listing", type: "error" }));
        }
    };

    if (!listing) return null;

    return (
            <Card>
                {/* Image on top */}
                <Card.Img
                    variant="top"
                    src={imageUrls?.[0] || "/assets/houseimage.webp"}
                    alt={name}
                    style={{ height: "250px", objectFit: "cover" }}
                    className="img"
                />

                {/* Content stacked below */}
                <Card.Body>
                    <Card.Title>
                        <BsFillHouseFill className="me-2 text-primary" />
                        {name}
                    </Card.Title>

                    <Card.Subtitle className="mb-2 text-muted">
                        <BsFillGeoAltFill className="me-2" />
                        {address?.pincode}, {address?.city}, {address?.state}, {address?.country}
                    </Card.Subtitle>

                    <Card.Text>{description}</Card.Text>

                    <div className="mb-3">
                        {discountedPrice > 0 ? (
                            <>
                                <h6 className="text-muted" style={{ textDecoration: "line-through" }}>
                                    ₹{regularPrice}
                                </h6>
                                <h5 className="text-success fw-bold">
                                    ₹{regularPrice - discountPrice}
                                </h5>
                            </>
                        ) : (
                            <h5 className="fw-bold">₹{regularPrice}</h5>
                        )}
                    </div>

                    <div className="mb-3 text-muted">
                        <BsClock className="me-1" />
                        <small>{new Date(createdAt).toLocaleDateString()}</small>
                    </div>

                    <Row className="mb-3 text-center">
                        <Col>
                            <FaBed className="me-1" />
                            {bedrooms} Bed
                        </Col>
                        <Col>
                            <FaBath className="me-1" />
                            {bathrooms} Bath
                        </Col>
                    </Row>

                    <Row className="mb-3 text-center">
                        <Col>
                            {furnished ? (
                                <Badge bg="success">
                                    <BsFillCheckCircleFill className="me-1" />
                                    Furnished
                                </Badge>
                            ) : (
                                <Badge bg="secondary">
                                    <BsXCircleFill className="me-1" />
                                    Not Furnished
                                </Badge>
                            )}
                        </Col>
                        <Col>
                            {parking ? (
                                <Badge bg="info">
                                    <BsFillCheckCircleFill className="me-1" />
                                    Parking
                                </Badge>
                            ) : (
                                <Badge bg="warning" text="dark">
                                    <BsXCircleFill className="me-1" />
                                    No Parking
                                </Badge>
                            )}
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <BsFillPersonFill className="me-1" />
                            <p>
                                {ownerName}
                            </p>
                        </Col>
                        <Col>
                            <BsFillEnvelopeFill className="me-1" />
                            <p>
                                {ownerGmail}
                            </p>
                        </Col>
                    </Row>

                    <div className="d-flex flex-column align-items-end">
                        <Link to={`/listing/${_id}`}>
                            <Button size="sm" variant="primary">
                                View
                            </Button>
                        </Link>
                        {
                            userGmail === ownerGmail
                            &&
                            <Button
                                variant="danger"
                                size="sm"
                                className={loading ? "mt-2 disabled" : "mt-2"}
                                onClick={() => onDelete(_id)}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </Button>
                        }
                    </div>
                </Card.Body>
            </Card>
    );
}
