import { Link } from "react-router-dom";
import verifyEmail from "../../utils/verifyEmail.js";
import { Row, Col, Button, Nav } from 'react-bootstrap';
import { FaHome, FaPlusCircle, FaQuestionCircle } from "react-icons/fa";

export default function EmailVerification({ props }) {
    const {
        state,
        setVerifyText,
        setLoading,
        dispatch,
        signInSuccess,
        token,
        verifyButton,
        loading,
        details
    } = props;

    const isPropertyOwnerOrAgent = ["Property Owner", "Agent"].includes(details?.UserType);

    return (
        <Row className="align-items-center mb-4">
            <Col md={6} className="mb-3 mb-md-0">
                <h6 className="text-secondary">Email</h6>
                <p className="fw-semibold text-dark mb-0">{state?.gmail}</p>
            </Col>

            <Col md={6} className="text-md-end">
                <h6 className="text-secondary">Email Verification</h6>
                <Button
                    variant={state?.emailVerified || loading ? "primary disabled" : "outline-primary"}
                    onClick={() =>
                        verifyEmail(state, setVerifyText, setLoading, dispatch, signInSuccess, token)
                    }
                    className="mb-2"
                >
                    {state?.emailVerified ? "Verified ✓" : verifyButton}
                </Button>

                {state?.emailVerified && (
                    <div className="d-flex justify-content-md-end justify-content-start">
                        <div className="mt-2 bg-light border border-1 rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2">
                            <Nav.Link
                                as={Link}
                                to={isPropertyOwnerOrAgent ? "/add-listing" : "/listings"}
                                className={`text-decoration-none d-flex align-items-center gap-2 ${loading ? 'disabled text-muted' : 'text-primary'}`}
                            >
                                <FaHome />
                                {isPropertyOwnerOrAgent ? "Add Property" : "Find Property"}
                                {isPropertyOwnerOrAgent ? <FaPlusCircle /> : <FaQuestionCircle />}
                            </Nav.Link>
                        </div>
                    </div>
                )}
            </Col>
        </Row>
    );
}
