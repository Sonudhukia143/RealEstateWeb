import verifyEmail from "../../utils/verifyEmail.js";
import {  Row, Col, Button } from 'react-bootstrap';

export default function EmailVerification({props}) {
    const {state,setVerifyText, setLoading, dispatch, signInSuccess, token, verifyButton, loading} = props;

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
            </Col>
        </Row>
    );
}