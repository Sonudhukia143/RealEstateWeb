import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../utils/fetchData.js";
import ListingCard from "../helperComponents/ListingCard.jsx";
import {
    Container,
    Row,
    Col,
    Pagination,
    Spinner,
    Badge,
} from "react-bootstrap";
import {
    deleteListingById,
    fetchAllListings,
    setShouldFetchAllListingsFalse,
    setShouldFetchAllListingsTrue,
} from "../redux/listing/listingAdded.js";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import { HouseDoorFill } from "react-bootstrap-icons"; // You can choose any Bootstrap icon

export default function AllListings() {
    const userState = useSelector((state) => state?.user?.currentUser);
    const token = userState?.token;
    const listings = useSelector((state) => state?.listing?.allListings);
    const shouldFetchAllListings = useSelector(
        (state) => state.listing?.shouldFetchAllListings
    );

    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 6;

    // Fetch all listings
    useEffect(() => {
        const fetchAllListingData = async () => {
            try {
                const response = await fetchData(
                    "/api/listings",
                    null,
                    "ALLLISTINGS",
                    token
                );
                const data = await response.json();
                if (response.status === 200) {
                    dispatch(fetchAllListings(data.listings));
                    dispatch(setShouldFetchAllListingsFalse());
                    dispatch(setFlashMessage({ message: data.message, type: "success" }));
                } else {
                    dispatch(setFlashMessage({ message: data.message, type: "error" }));
                    dispatch(setShouldFetchAllListingsFalse());
                    dispatch(fetchAllListings([]));
                }
            } catch (error) {
                dispatch(
                    setFlashMessage({ message: "Error fetching all listings" })
                );
            }
        };

        if (shouldFetchAllListings) {
            fetchAllListingData();
        }
    }, [shouldFetchAllListings]);

    // Delete handler passed to ListingCard
    const handleDelete = async (id) => {
        try {
            const response = await fetchData(
                `/api/delete-listing/${id}`,
                null,
                "DELETELISTING",
                token
            );
            const data = await response.json();

            if (response.status === 200 || response.ok) {
                dispatch(setFlashMessage({ message: data.message, type: "success" }));
                dispatch(deleteListingById({ id: id }));
                dispatch(setShouldFetchAllListingsTrue());
            } else {
                dispatch(setFlashMessage({ message: data.message, type: "error" }));
            }
        } catch (error) {
            dispatch(setFlashMessage({ message: error.message, type: "error" }));
        }
    };

    // Pagination calculations
    const indexOfLast = currentPage * listingsPerPage;
    const indexOfFirst = indexOfLast - listingsPerPage;
    const currentListings =
        listings?.length > 0 ? listings.slice(indexOfFirst, indexOfLast) : 0;
    const totalPages =
        listings?.length > 0 ? Math.ceil(listings.length / listingsPerPage) : 0;

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
            {/* Hero Section */}
            <div
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #0d6efd, #6610f2)",
                    color: "white",
                    padding: "40px 0",
                    textAlign: "center",
                }}
            >
                <HouseDoorFill size={50} className="mb-3" />
                <h1 className="fw-bold">Discover Your Next Home</h1>
                <p className="lead">Browse through all available listings</p>
            </div>

            <Container className="mt-5">
                {
                    listings != null
                    &&
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        {
                            listings.length > 0
                                ?
                                <h2 className="fw-semibold text-secondary">
                                    All Listings <Badge bg="primary">{listings?.length}</Badge>
                                </h2>
                                :
                                <h2 className="fw-semibold text-secondary">
                                    No Listings <Badge bg="primary">{0}</Badge>
                                </h2>
                        }
                    </div>
                }

                {listings == null ? (
                    <div className="text-center">
                        <h2 className="fw-semibold text-secondary">Organizing Your Data</h2>
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Row xs={1} sm={2} md={3} className="g-4">
                            {listings?.length > 0 &&
                                currentListings.map((listing) => (
                                    <Col key={listing._id}>
                                        <ListingCard
                                            listing={listing}
                                            onDelete={handleDelete}
                                            userGmail={userState?.user?.gmail}
                                        />
                                    </Col>
                                ))}
                        </Row>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center mt-5">
                                <Pagination size="lg">
                                    <Pagination.Prev
                                        onClick={() =>
                                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                                        }
                                        disabled={currentPage === 1}
                                    />
                                    {[...Array(totalPages).keys()].map((num) => (
                                        <Pagination.Item
                                            key={num + 1}
                                            active={currentPage === num + 1}
                                            onClick={() => setCurrentPage(num + 1)}
                                        >
                                            {num + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}
