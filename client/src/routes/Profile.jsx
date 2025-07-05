import { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Pagination
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess, setInfoUser, setUserLoc } from '../redux/user/userSlice.js';
import { FaCircle, FaUser } from 'react-icons/fa';
import NoLoggedIn from '../helperComponents/profileComponents/NoLoggedIn.jsx';
import UserInfo from '../helperComponents/profileComponents/UserInfo.jsx';
import UserInfoForm from '../helperComponents/profileComponents/UserInfoForm.jsx';
import fetchDetails from '../utils/intialUserInfoFetch.js';
import ProfileInfo from '../helperComponents/profileComponents/ProfileInfo.jsx';
import EmailVerification from '../helperComponents/profileComponents/EmailVerification.jsx';
import { setFlashMessage } from '../redux/flash/flashMessage.js';
import '../../styles/profile.css';
import ProfileMap from '../helperComponents/profileComponents/ProfileMap.jsx';
import fetchMap from '../utils/fetchMap.js';
import fetchData from '../utils/fetchData.js';
import ListingCard from '../helperComponents/ListingCard.jsx';
import {
  deleteAdminListingById,
  fetchListings,
  setShouldFetchListingsFalse
} from '../redux/listing/listingAdded.js';

export default function Profile() {
  const userState = useSelector(state => state.user?.currentUser);
  const state = userState?.user;
  const details = userState?.details;
  const token = userState?.token;
  const Info = userState?.details;
  const loc = userState?.location;
  const shouldFetchListing = useSelector(state => state.listing?.shouldFetchListings);
  const listing = useSelector(state => state.listing?.listings);

  const dispatch = useDispatch();

  const [verifyButton, setVerifyText] = useState("📧 Verify Email");
  const [loading, setLoading] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [userInfo, setUserInfo] = useState(!Array.isArray(Info) ? Info : "");
  const [infoFields, setInfoFields] = useState([
    { type: 'city', content: Info?.city || "" },
    { type: 'pincode', content: Info?.pincode || "" },
    { type: 'state', content: Info?.state || "" },
    { type: 'country', content: Info?.country || "" },
    { type: 'UserType', content: Info?.UserType || "" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 6;
  const indexOfLast = currentPage * listingsPerPage;
  const indexOfFirst = indexOfLast - listingsPerPage;
  const currentListings = listing?.slice(indexOfFirst, indexOfLast);
  const totalPages = listing ? Math.ceil(listing.length / listingsPerPage) : 0;

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...infoFields];
    updatedFields[index][field] = value;
    setInfoFields(updatedFields);
  };

  useEffect(() => {
    if (loc && !showInfoForm && state?.emailVerified) fetchMap(loc);
  }, [Info, showInfoForm, state?.emailVerified, loc]);

  useEffect(() => {
    if (state?.emailVerified) {
      if (Info?.pincode && Info?.city && Info?.state && Info?.country) {
        const fetchLoc = async () => {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?postcode=${Info?.pincode}&city=${Info?.city}&state=${Info?.state}&country=${Info?.country}&format=json&apiKey=${import.meta.env.VITE_GEOLOCATION_API_KEY}`
          );
          const data = await response.json();
          if (data?.results?.length > 0) {
            dispatch(setUserLoc({ lat: data.results[0].lat, lon: data.results[0].lon }));
          } else {
            dispatch(setFlashMessage({ message: "Enter a Valid Location to Get on Map", type: "error" }));
            dispatch(setUserLoc(null));
          }
        };
        fetchLoc();
      }

      if (!Info) {
        const mountFetching = async () => {
          const res = await fetchDetails(setLoading, token);
          const data = await res.json();
          if (res.ok) {
            setUserInfo(data.details || []);
            setInfoFields([
              { type: 'city', content: data.details?.city },
              { type: 'pincode', content: data.details?.pincode },
              { type: 'state', content: data.details?.state },
              { type: 'country', content: data.details?.country },
              { type: 'UserType', content: data.details?.UserType },
            ]);
            dispatch(setInfoUser(data.details));
            dispatch(setFlashMessage({ message: data.message, type: "success" }));
          } else {
            dispatch(setFlashMessage({ message: data.message, type: "error" }));
            dispatch(setInfoUser([]));
          }
        };
        mountFetching();
      }
    }
  }, [Info, state?.emailVerified]);

  useEffect(() => {
    if (shouldFetchListing) {
      (async () => {
        try {
          const res = await fetchData("https://bank-website-23d3.vercel.app/api/admin/listings", null, "GETLISTINGADMIN", token);
          const data = await res.json();
          if (res.ok) {
            dispatch(fetchListings(data.listings));
            dispatch(setFlashMessage({ message: data.message, type: "success" }));
          } else {
            dispatch(fetchListings([]));
            dispatch(setFlashMessage({ message: data.message, type: "error" }));
          }
        } catch {
          dispatch(setFlashMessage({ message: "Error fetching listings", type: "error" }));
        } finally {
          dispatch(setShouldFetchListingsFalse());
        }
      })();
    }
  }, [shouldFetchListing]);

  const onDelete = async (id) => {
    try {
      const res = await fetchData(`https://bank-website-23d3.vercel.app/api/delete-listing/${id}`, null, "DELETELISTING", token);
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteAdminListingById({ id }));
        dispatch(setFlashMessage({ message: data.message, type: "success" }));
      } else {
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      }
    } catch {
      dispatch(setFlashMessage({ message: "Error deleting listing", type: "error" }));
    }
  };

  if (!state) return <NoLoggedIn />;

  return (
    <Container className="mt-5">
      <Row>
        <ProfileInfo props={{ state, loading }} />
        <Col md={8}>
          <Card className="shadow-lg bg-white border-0 rounded">
            <Card.Body>
              <Card.Title className="text-primary mb-3">User Information</Card.Title>
              <EmailVerification props={{ state, setVerifyText, setLoading, dispatch, signInSuccess, token, verifyButton, loading, details }} />

              {state?.emailVerified ? (
                <>
                  {loading && !showInfoForm ? (
                    <div className="text-muted">
                      <FaCircle className="spinner-border me-2 text-primary" />
                      <b>Fetching Info</b>
                    </div>
                  ) : showInfoForm ? (
                    <UserInfoForm props={{ infoFields, handleFieldChange, setShowInfoForm, loading, setLoading, token, setUserInfo, setInfoFields }} />
                  ) : (
                    <>
                      <UserInfo userInfo={userInfo} />
                      <ProfileMap />
                      <Button variant="outline-primary" className="mt-4" onClick={() => setShowInfoForm(true)}>
                        Update Info
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <FaUser className="mt-4" />
                  <p className="mt-2 fw-semibold">Verify Email to Enjoy Other Services</p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Listings Section */}
      <Row className="mt-5">
        <Col>
          {listing == null ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} />
              <p className="mt-2 fw-semibold text-muted">Fetching Listings...</p>
            </div>
          ) : listing?.length > 0 ? (
            <>
              <h4 className="text-center mb-4 text-primary fw-bold">Your Listings</h4>
              <Row>
                {currentListings.map(listing => (
                  <Col md={4} className="mb-4" key={listing._id}>
                    <Card className="shadow-sm border-0 h-100">
                      <Card.Body>
                        <ListingCard listing={listing} onDelete={onDelete} userGmail={state?.gmail} />
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination size="lg">
                    <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} />
                    {[...Array(totalPages).keys()].map(num => (
                      <Pagination.Item key={num + 1} active={currentPage === num + 1} onClick={() => setCurrentPage(num + 1)}>
                        {num + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-5">
              <p className="text-muted">No Listings Found</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
