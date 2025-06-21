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
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import {
  deleteListingById,
  fetchAllListings,
  setShouldFetchAllListingsFalse,
  setShouldFetchAllListingsTrue,
} from "../redux/listing/listingAdded.js";
import { setFlashMessage } from "../redux/flash/flashMessage.js";
import {
  HouseDoorFill,
  FilterCircle,
  FunnelFill,
  GeoAltFill,
  CheckCircleFill,
} from "react-bootstrap-icons";
import "../../styles/profile.css";
import getDistanceFromLatLonInKm from "../utils/distanceCalculator.js";

export default function AllListings() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state?.user?.currentUser);
  const token = userState?.token;
  const listingsData = useSelector((state) => state?.listing?.allListings);
  const shouldFetchAllListings = useSelector(
    (state) => state.listing?.shouldFetchAllListings
  );
  const userLoc = userState?.location;

  const [listings, setListings] = useState(listingsData);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 6;

  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("name");
  const [additionalFilter, setAdditionalFilter] = useState({
    parking: false,
    furnished: false,
    type: "rent",
  });

  useEffect(() => {
    const fetchAllListingData = async () => {
      try {
        const response = await fetchData("https://bank-website-23d3.vercel.app/api/listings", null, "ALLLISTINGS", token);
        const data = await response.json();
        if (response.status === 200) {
          dispatch(fetchAllListings(data.listings));
          dispatch(setShouldFetchAllListingsFalse());
          dispatch(setFlashMessage({ message: data.message, type: "success" }));
          setListings(data.listings);
        } else {
          dispatch(setFlashMessage({ message: data.message, type: "error" }));
          dispatch(fetchAllListings([]));
          setListings([]);
        }
      } catch (error) {
        dispatch(setFlashMessage({ message: "Error fetching all listings", type: "error" }));
      }
    };

    if (shouldFetchAllListings) {
      fetchAllListingData();
    }
  }, [shouldFetchAllListings]);

  const handleDelete = async (id) => {
    try {
      const response = await fetchData(`https://bank-website-23d3.vercel.app/api/delete-listing/${id}`, null, "DELETELISTING", token);
      const data = await response.json();
      if (response.ok) {
        dispatch(setFlashMessage({ message: data.message, type: "success" }));
        dispatch(deleteListingById({ id }));
        dispatch(setShouldFetchAllListingsTrue());
      } else {
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(setFlashMessage({ message: error.message, type: "error" }));
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      setListings(listingsData);
    } else if (queryType === "name") {
      setListings(listingsData.filter((listing) => listing.name.toLowerCase().includes(value.toLowerCase())));
    } else if (queryType === "discount") {
      setListings(listingsData.filter((listing) => Number(listing.discountPrice) >= Number(value)));
    } else if (queryType === "price") {
      setListings(listingsData.filter((listing) => Number(listing.regularPrice) >= Number(value)));
    } else if (queryType === "date") {
      const daysInMs = value * 24 * 60 * 60 * 1000;
      const filtered = listingsData.filter((listing) => {
        const createdTime = new Date(listing.createdAt).getTime();
        return !isNaN(createdTime) && Date.now() - createdTime <= daysInMs;
      });
      setListings(filtered);
    } else if (queryType === "distance") {
      const results = await Promise.all(
        listingsData.map(async (listing) => {
          try {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/search?postcode=${listing?.address?.pincode}&city=${listing?.address?.city}&state=${listing?.address?.state}&country=${listing?.address?.country}&format=json&apiKey=${import.meta.env.VITE_GEOLOCATION_API_KEY}`
            );
            const data = await response.json();
            if (response.ok && data.results?.[0]) {
              const { lat, lon } = data.results[0];
              const distance = getDistanceFromLatLonInKm(lat, lon, userLoc?.lat, userLoc?.lon);
              return { listing, distance };
            }
          } catch {
            return { listing, distance: Infinity };
          }
        })
      );

      setListings(results.filter(({ distance }) => distance <= value).map(({ listing }) => listing));
    }
  };

  useEffect(() => {
    if(listingsData){
            let filtered = listingsData;

    if (additionalFilter.furnished) {
      filtered = filtered.filter((listing) => listing.furnished === true);
    }
    if (additionalFilter.parking) {
      filtered = filtered.filter((listing) => listing.parking === true);
    }
    if (additionalFilter.type) {
      filtered = filtered.filter((listing) => listing.type === additionalFilter.type);
    }

    setListings(filtered);
    }
  }, [additionalFilter, listingsData,query]);

  const changeQueryType = (e) => {
    setQueryType(e.target.value);
  };

  const indexOfLast = currentPage * listingsPerPage;
  const indexOfFirst = indexOfLast - listingsPerPage;
  const currentListings = listings?.slice(indexOfFirst, indexOfLast) || [];
  const totalPages = Math.ceil((listings?.length || 0) / listingsPerPage);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ backgroundImage: "linear-gradient(to right, #0d6efd, #6610f2)", color: "white", padding: "40px 0", textAlign: "center" }}>
        <HouseDoorFill size={50} className="mb-3" />
        <h1 className="fw-bold">Discover Your Next Home</h1>
        <p className="lead">Browse through all available listings</p>
      </div>

      <div className="justify-content-center m-4" id="search-filter-div">
        <span id="inner-span">
          <InputGroup className="shadow-sm rounded-pill">
            <FormControl
              placeholder="🔍 Search by your filter..."
              aria-label="Search"
              value={query}
              onChange={handleSearchChange}
              className="border-1 rounded-pill border-black"
            />
          </InputGroup>
        </span>

        <span id="inner-span">
          <Container className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                <FunnelFill /> Choose Filter Type
              </Form.Label>
              <Form.Select onChange={changeQueryType}>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="discount">Discount</option>
                <option value="distance">Distance from You</option>
                <option value="date">Date Added</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="fw-bold">
                <FilterCircle /> Additional Filters
              </Form.Label>
              <div className="d-flex flex-wrap gap-3">
                <Form.Check
                  type="checkbox"
                  label={<><CheckCircleFill className="me-1 text-success" /> Parking</>}
                  id="checkbox-parking"
                  checked={additionalFilter.parking}
                  onChange={(e) => setAdditionalFilter((prev) => ({ ...prev, parking: e.target.checked }))}
                />
                <Form.Check
                  type="checkbox"
                  label={<><CheckCircleFill className="me-1 text-warning" /> Furnished</>}
                  id="checkbox-furnished"
                  checked={additionalFilter.furnished}
                  onChange={(e) => setAdditionalFilter((prev) => ({ ...prev, furnished: e.target.checked }))}
                />
                <Form.Check
                  type="radio"
                  label={<><GeoAltFill className="me-1 text-info" /> Rent</>}
                  name="rentSaleOption"
                  id="radio-rent"
                  checked={additionalFilter.type === "rent"}
                  onChange={() => setAdditionalFilter((prev) => ({ ...prev, type: "rent" }))}
                />
                <Form.Check
                  type="radio"
                  label={<><GeoAltFill className="me-1 text-danger" /> Sale</>}
                  name="rentSaleOption"
                  id="radio-sale"
                  checked={additionalFilter.type === "sale"}
                  onChange={() => setAdditionalFilter((prev) => ({ ...prev, type: "sale" }))}
                />
              </div>
            </Form.Group>
          </Container>
        </span>
      </div>

      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-semibold text-secondary">
            {listings?.length > 0 ? "All Listings" : "No Listings"} <Badge bg="primary">{listings?.length || 0}</Badge>
          </h2>
        </div>

        {listings == null ? (
          <div className="text-center">
            <h2 className="fw-semibold text-secondary">Organizing Your Data</h2>
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Row xs={1} sm={2} md={3} className="g-4">
              {currentListings.map((listing) => (
                <Col key={listing._id}>
                  <ListingCard
                    listing={listing}
                    onDelete={handleDelete}
                    userGmail={userState?.user?.gmail}
                  />
                </Col>
              ))}
            </Row>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-5">
                <Pagination size="lg">
                  <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                  {[...Array(totalPages).keys()].map((num) => (
                    <Pagination.Item key={num + 1} active={currentPage === num + 1} onClick={() => setCurrentPage(num + 1)}>
                      {num + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
