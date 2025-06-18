import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ListingCard({ listing, onDelete, userGmail }) {
    const {
        _id,
        name,
        description,
        imageUrls,
        regularPrice,
        discountPrice,
        type,
        address,
        offer,
        ownerGmail
    } = listing;
    const [loading, setLoading] = useState(false);


    const deleteListing = async (id) => {
        setLoading(true);
        try {
            await onDelete(id);
        } catch (error) {
            console.error("Error deleting listing:", error);
        }
    }

    return (
        <Card className="shadow-sm border rounded overflow-hidden">
            <Card.Img
                variant="top"
                src={imageUrls[0]}
                style={{ height: "200px", objectFit: "cover" }}
            />

            <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title className="text-truncate">{name}</Card.Title>

                <Card.Text className="text-muted small mb-1">
                    {address.city}, {address.state}
                </Card.Text>

                <Card.Text className="small">
                    {description.substring(0, 70)}...
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>
                        {offer ? (
                            <>
                                <Badge bg="success">Offer</Badge>{" "}
                                <strong className="text-danger">₹{discountPrice}</strong>
                                <span className="text-muted text-decoration-line-through ms-1">
                                    ₹{regularPrice}
                                </span>
                            </>
                        ) : (
                            <strong>₹{regularPrice}</strong>
                        )}
                        {type === "rent" && <span className="ms-1 text-muted">/ month</span>}
                    </div>

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
                                onClick={() => deleteListing(_id)}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </Button>
                        }
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
