import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
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

export default function Profile() {
  const userState = useSelector(state => state.user?.currentUser);
  const state = userState?.user;
  const details = userState?.details;
  const token = userState?.token;
  const Info = userState?.details;
  const loc = userState?.location;

  const dispatch = useDispatch();

  const [verifyButton, setVerifyText] = useState("📧 Verify Email");
  const [loading, setLoading] = useState(false);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [userInfo, setUserInfo] = useState(!Array.isArray(Info) ? Info : "");
  const [infoFields, setInfoFields] = useState([
    { type: 'city', content: Info?.city ? Info?.city : "" },
    { type: 'pincode', content: Info?.pincode ? Info?.pincode : "" },
    { type: 'state', content: Info?.state ? Info?.state : "" },
    { type: 'country', content: Info?.country ? Info?.country : "" },
    { type: 'UserType', content: Info?.UserType ? Info?.UserType : "" },
  ]);

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...infoFields];
    updatedFields[index][field] = value;
    setInfoFields(updatedFields);
  };

  useEffect(() => {
    if (loc !== null && loc && loc !== undefined) {
      if(showInfoForm == false && state?.emailVerified){
        fetchMap(loc);
      }
    }
  }, [Info,showInfoForm,state?.emailVerified,loc]);


  useEffect(() => {
    if(state?.emailVerified){
      if (Info && Info?.pincode && Info?.city && Info?.state && Info?.country) {
        const fetchLoc = async () => {
          const response = await fetch(`https://api.geoapify.com/v1/geocode/search?postcode=${Info?.pincode}&city=${Info?.city}&state=${Info?.state}&country=${Info?.country}&format=json&apiKey=${import.meta.env.VITE_GEOLOCATION_API_KEY}`);
          const data = await response.json();
          if(data?.results?.length > 0 && data?.results[0]?.lat && data?.results[0]?.lon){
            dispatch(setUserLoc({ lat: data.results[0].lat, lon: data.results[0].lon }));
          }else{
            dispatch(setFlashMessage({message:"Enter a Valid Location to Get on Map",type:"error"}));
            dispatch(setUserLoc(null));
          }
        }
        fetchLoc();
      }
  
      if (!Info) {
        const mountFetching = async () => {
          const res = await fetchDetails(setLoading, token);
          const data = await res.json();
          if (res.ok || res.status == 200) {
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
        }
        mountFetching();
      }
    }
  }, [Info,state?.emailVerified]);

  useEffect(() => {
    async function fetchUserData() {
      console.log("FETCHING INFO");
      const res = await fetchData("/api/admin/listings", null, "GETLISTINGADMIN", token);
      const data = await res.json();
      console.log(data);
    }
    fetchUserData();
  },[])

  return (
    <>
      {state ? (
        <Container className="mt-5">
          <Row>
          <ProfileInfo props={{state,loading}} />
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>User Information</Card.Title>
                  <EmailVerification props={{ state, setVerifyText, setLoading, dispatch, signInSuccess, token, verifyButton, loading , details}} />
                  {
                    state?.emailVerified
                    ?
                    <>
                    {
                    !showInfoForm && loading ?
                      <div className='m-4'>
                        <FaCircle className={`spinner-border text-primary ${loading ? 'd-inline' : 'd-none'}`} />
                        <b> Fetching Info</b>
                      </div>
                      : !showInfoForm &&
                      <>
                        <UserInfo userInfo={userInfo} />
                        <ProfileMap />
                      </>
                  }
                  {showInfoForm ? (
                    <UserInfoForm props={{ infoFields, handleFieldChange, setShowInfoForm, loading, setLoading, token, setUserInfo, setInfoFields}} />
                  ) : (
                    !loading &&
                    <Button className="mt-4" variant="outline-primary" onClick={() => setShowInfoForm(true)}>
                      Update Info
                    </Button>
                  )}
                  </>
                  :
                  <>
                  <FaUser className="mt-4"></FaUser>
                  <p className="mt-2"><b>Verify Email To Enjoy Other Services.</b></p>
                  </>
                  }
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        <NoLoggedIn />
      )}
    </>
  );
}