import { useEffect } from "react";
import Box from "../helperComponents/Box.jsx";
import fetchData from "../utils/fetchData.js";
import { useDispatch, useSelector } from "react-redux";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import { fetchInitialFetchListings, setShouldFetchInitialListingsFalse } from "../redux/listing/listingAdded.js";
import { Spinner } from "react-bootstrap";

export default function Home() {
    const listings = useSelector(state => state.listing?.initialFetchListings);
    const shouldFetchInitialListings = useSelector(state => state.listing?.shouldFetchInitialListings);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const res = await fetchData("/api/initial-fetch", null, "INITIALFETCH", null);
                const data = await res.json();
                if (res.status === 200) {
                    dispatch(fetchInitialFetchListings(data));
                    dispatch(setShouldFetchInitialListingsFalse());
                    dispatch(setFlashMessage({ message: data.message, type: "success" }));
                } else {
                    dispatch(fetchInitialFetchListings([]));
                    dispatch(setShouldFetchInitialListingsFalse());
                    dispatch(setFlashMessage({ message: data.message, type: "error" }));
                }
            } catch (err) {
                dispatch(setFlashMessage({ message: err.message, type: "error" }));
            }
        }

        console.log(shouldFetchInitialListings);

        if (shouldFetchInitialListings) {
            fetchInitialData();
        }
    }, [shouldFetchInitialListings]);

    return (
        <>
            <div className="mainDiv">
                <div className="leftDiv">
                    <h1 style={{ color: "grey" }}>FIND YOUR HOMES ALL <b style={{ color: "lightgrey" }}>AROUND</b> THE GLOBE
                        <button><a href="#properties">Start Here...</a></button>
                    </h1>
                </div>
                <div className="rightDiv">

                </div>
            </div>

            <div className="properties" id="properties">
                <span className="offers" key={"weeklyLisitings"}>
                    <h3>Recent offers</h3>
                    <p><a href="#">Show more offers</a></p>
                    <div className="dividingDiv">

                        {
                            listings === null
                                ?
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", padding: "2rem" }}>
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                </div>
                                :
                                listings?.weeklyListings?.length > 0
                                    ?
                                    listings?.weeklyListings?.map(listing => {
                                        return (
                                            <span className="boxes" key={listing?._id}>
                                                <Box listing={listing} />
                                            </span>
                                        );
                                    })
                                    : <div style={{
                                        textAlign: "center",
                                        marginTop: "4rem",
                                        padding: "2rem",
                                        border: "1px solid lightgray",
                                        borderRadius: "12px",
                                        backgroundColor: "#f8f9fa"
                                    }}>
                                        <h2 style={{ color: "slategray", fontWeight: "600" }}>😔 Oops! No Listings Found</h2>
                                        <p style={{ color: "gray" }}>
                                            We couldn't find any listings in this category right now.
                                            <br />
                                            Try checking back later or explore other categories!
                                        </p>
                                    </div>
                        }
                    </div>
                </span>

                <span className="offers" key={"randomRentListings"}>
                    <h3>Recent places for rent</h3>
                    <p><a href="#">Show more places for rent</a></p>
                    <div className="dividingDiv">
                        {
                            listings === null
                                ?
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", padding: "2rem" }}>
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                </div>
                                :
                                listings?.randomRentListings?.length > 0
                                    ?
                                    listings?.randomRentListings?.map(listing => {
                                        return (
                                            <span className="boxes" key={listing?._id}>
                                                <Box listing={listing} />
                                            </span>
                                        );
                                    })
                                    :
                                    <div style={{
                                        textAlign: "center",
                                        marginTop: "4rem",
                                        padding: "2rem",
                                        border: "1px solid lightgray",
                                        borderRadius: "12px",
                                        backgroundColor: "#f8f9fa"
                                    }}>
                                        <h2 style={{ color: "slategray", fontWeight: "600" }}>😔 Oops! No Listings Found</h2>
                                        <p style={{ color: "gray" }}>
                                            We couldn't find any listings in this category right now.
                                            <br />
                                            Try checking back later or explore other categories!
                                        </p>
                                    </div>
                        }
                    </div>
                </span>

                <span className="offers" key={"randomSaleListings"}>
                    <h3>Recent places for sale</h3>
                    <p><a href="#">Show more places for sale</a></p>
                    <div className="dividingDiv">
                        {
                            listings === null
                                ?
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", padding: "2rem" }}>
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                    <Spinner animation="grow" variant="primary" size="sm" />
                                </div>
                                :
                                listings?.randomSaleListings?.length > 0
                                    ?
                                    listings?.randomSaleListings?.map(listing => {
                                        return (
                                            <span className="boxes" key={listing?._id}>
                                                <Box listing={listing} />
                                            </span>
                                        );
                                    })
                                    :
                                    <div style={{
                                        textAlign: "center",
                                        marginTop: "4rem",
                                        padding: "2rem",
                                        border: "1px solid lightgray",
                                        borderRadius: "12px",
                                        backgroundColor: "#f8f9fa"
                                    }}>
                                        <h2 style={{ color: "slategray", fontWeight: "600" }}>😔 Oops! No Listings Found</h2>
                                        <p style={{ color: "gray" }}>
                                            We couldn't find any listings in this category right now.
                                            <br />
                                            Try checking back later or explore other categories!
                                        </p>
                                    </div>
                        }
                    </div>
                </span>
            </div>
        </>
    )
}