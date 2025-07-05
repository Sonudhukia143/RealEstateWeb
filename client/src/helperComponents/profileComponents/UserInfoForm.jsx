import { Form, Row, Col, Button } from "react-bootstrap";
import { FaCircleNotch, FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setFlashMessage } from "../../redux/flash/flashMessage.js";
import { setInfoUser } from "../../redux/user/userSlice.js";
import "animate.css";

export default function UserInfoForm({ props }) {
    const {
        infoFields,
        handleFieldChange,
        setShowInfoForm,
        loading,
        setLoading,
        token,
        setUserInfo,
        setInfoFields,
    } = props;

    const dispatch = useDispatch();

    const handleSaveInfo = async () => {
        try {
            const checkInput = infoFields.map(info => info.content?.trim() !== "");
            if (checkInput.includes(false)) {
                throw new Error("Please fill in all fields.");
            }

            const validFields = infoFields.reduce((acc, field) => {
                if (field.type && field.content?.trim()) {
                    acc[field.type] = field.content.trim();
                }
                return acc;
            }, {});

            setLoading(true);

            const res = await fetch('https://bank-website-23d3.vercel.app/api/add-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ additionalInfo: validFields }),
            });

            const data = await res.json();

            if (res.ok) {
                setShowInfoForm(false);
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
            }

        } catch (error) {
            dispatch(setFlashMessage({ message: error.message, type: "error" }));
        } finally {
            setShowInfoForm(false);
            setLoading(false);
        }
    };

    return (
        <Form className="p-3 animate__animated animate__fadeIn bg-white rounded shadow-sm border">
            {infoFields?.map((field, index) => (
                <Row key={index} className="mb-3 align-items-center">
                    <Col xs={4} className="text-capitalize fw-semibold text-secondary">
                        <Form.Label>{field.type}</Form.Label>
                    </Col>
                    <Col xs={8}>
                        {field.type === 'UserType' ? (
                            <Form.Select
                                value={field.content}
                                onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                                className="shadow-sm"
                            >
                                <option value="">Choose yourself</option>
                                <option value="Renter">Renter</option>
                                <option value="Buyer">Buyer</option>
                                <option value="Property Owner">Property Owner</option>
                                <option value="Agent">Agent</option>
                            </Form.Select>
                        ) : (
                            <Form.Control
                                type="text"
                                placeholder={`Enter ${field.type}`}
                                value={field.content}
                                onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                                className="shadow-sm"
                            />
                        )}
                    </Col>
                </Row>
            ))}

            <div className="d-flex justify-content-end mt-4 gap-3">
                {!loading && (
                    <Button variant="outline-secondary" onClick={() => setShowInfoForm(false)}>
                        Cancel
                    </Button>
                )}
                <Button
                    variant={loading ? 'primary' : 'outline-primary'}
                    disabled={loading}
                    onClick={handleSaveInfo}
                    className="d-flex align-items-center justify-content-center"
                >
                    {loading ? (
                        <>
                            <FaCircleNotch className="me-2 fa-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <FaCheck className="me-2" />
                            Save
                        </>
                    )}
                </Button>
            </div>
        </Form>
    );
}
