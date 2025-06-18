import { Link } from "react-router-dom";
import verifyEmail from "../../utils/verifyEmail.js";
import { Row, Col, Button, Nav } from 'react-bootstrap';
import { FaHome, FaPlusCircle, FaQuestion } from "react-icons/fa";

export default function EmailVerification({ props }) {
    const { state, setVerifyText, setLoading, dispatch, signInSuccess, token, verifyButton, loading , details} = props;



    console.log(details?.UserType);
    return (
        <Row>
            <Col md={6}>
                <h6>Email</h6>
                <p>{state?.gmail}</p>
            </Col>
            <Col md={6}>
                <h6>Is User Verified</h6>
                <Button
                    variant={state?.emailVerified || loading ? "primary disabled" : "outline-primary"}
                    onClick={() => verifyEmail(state, setVerifyText, setLoading, dispatch, signInSuccess, token)}
                >
                    {state?.emailVerified ? "Verified ✓" : verifyButton}
                </Button>
                <div className="mt-4 d-flex align-items-center justify-content-flexstart bg-light border border-1 rounded-3 p-2 w-50">
                    {
                        state?.emailVerified
                        &&
                        (
                            (details?.UserType === ('Property Owner' || 'Agent'))
                                ? 
                                <Nav.Link as={Link} className={loading ? 'disabled' : ''} to="/add-listing">
                                    <FaHome></FaHome> Add Property <FaPlusCircle></FaPlusCircle>
                                </Nav.Link>
                                :
                                <Nav.Link as={Link} className={loading ? 'disabled' : ''} to="/listings">
                                    <FaHome></FaHome> Find Property <FaQuestion></FaQuestion>
                                </Nav.Link>
                        )
                    }
                </div>
            </Col>
        </Row >
    );
}