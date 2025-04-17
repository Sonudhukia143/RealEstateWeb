import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Image, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';
import { FaPlus, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import ProfileInfo from '../helperComponents/profileComponents/ProfileInfo.jsx';
import NoLoggedIn from '../helperComponents/profileComponents/NoLoggedIn.jsx';
import EmailVerification from '../helperComponents/profileComponents/EmailVerification.jsx';
import UserInfo from '../helperComponents/profileComponents/UserInfo.jsx';

export default function Profile() {
  const state = useSelector(state => state.user?.currentUser?.user);
  const token = useSelector(state => state.user?.currentUser?.token);
  const [verifyButton, setVerifyText] = useState("Verify Email");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [showInfoForm, setShowInfoForm] = useState(false);

  const [infoFields, setInfoFields] = useState([{ type: '', content: '' }]);
  const [userInfo, setUserInfo] = useState(null);

  const handleAddField = () => {
    setInfoFields([...infoFields, { type: '', content: '' }]);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...infoFields];
    updatedFields[index][field] = value;
    setInfoFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    if (infoFields.length === 1) return;
    const updatedFields = [...infoFields];
    updatedFields.splice(index, 1);
    setInfoFields(updatedFields);
  };

  const handleSaveInfo = async () => {
    try {
      const validFields = infoFields.filter(field => field.type.trim() && field.content.trim());
      if(!validFields || validFields.length < 0) return;
      
      const newInfo = [...userInfo, ...validFields];
      setShowInfoForm(false);
      setInfoFields([{ type: '', content: '' }]);

      setLoading(true);

      const res = await fetch('http://localhost:3000/api/add-info', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ additionalInfo: newInfo,token: token }),
      });
      const data = await res.json();
      console.log(data);
      console.log(res.status);
      if(res.status == 200){
        setUserInfo(newInfo);
        setShowInfoForm(false);
        setInfoFields([{ type: '', content: '' }]);
        setLoading(false);
      }else{
        setLoading(false);
      }
    } catch (error) {
      console.error('Error saving info:', error);
    }
  };

  const handleCancel = () => {
    setShowInfoForm(false);
    setInfoFields([{ type: '', content: '' }]);
  };


  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);

      try {
        const res = await fetch(`http://localhost:3000/api/fetch-info/${token}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
          setUserInfo(data.details || []);
        } else {
          console.error('Error fetching user details:', data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching user details:', error);
      }finally {
        setLoading(false);
      }
    }

    fetchDetails();
  },[setUserInfo]);

  return (
    <>
      {state ? (
        <Container className="mt-5">
          <Row>

            <ProfileInfo state={state} />

            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>User Information</Card.Title>
                  <EmailVerification props={{state,setVerifyText, setLoading, dispatch, signInSuccess, token, verifyButton, loading}} />
                  <UserInfo userInfo={userInfo} />

                  {/* Info form or update button */}
                  {showInfoForm ? (
                    <div className="mt-4">
                      <div className="d-flex justify-content-end">
                        <Button variant="outline-secondary" onClick={handleCancel} className="me-2">
                          Cancel
                        </Button>
                        <Button className={loading?`disabled primary`:``} variant={loading?'primary':'outline-primary'} onClick={handleSaveInfo}>
                          { loading? <><FaSpinner /> Saving</> : <><FaCheck /> Save</> }
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="mt-4" variant="outline-primary" onClick={() => setShowInfoForm(true)}>
                      Update Info
                    </Button>
                  )}
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