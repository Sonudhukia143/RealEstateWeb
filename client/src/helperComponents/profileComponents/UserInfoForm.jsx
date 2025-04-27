import { Form, Row, Col, Button } from "react-bootstrap";
import { FaCircle, FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setFlashMessage } from "../../redux/flash/flashMessage.js";
import { setInfoUser } from "../../redux/user/userSlice.js";

export default function UserInfoForm({ props }) {
    const { infoFields, handleFieldChange, setShowInfoForm, loading, setLoading, token ,setUserInfo,setInfoFields} = props;
    const dispatch = useDispatch();

    const handleSaveInfo = async () => {
        try {            
            if (infoFields.length <= 0) return;
            const validFields = infoFields.reduce((acc, field) => {
                if (field.type.trim() && field.content.trim()) {
                    acc[field.type] = field.content;
                }
                return acc;
            }, {});

            setLoading(true);

            const res = await fetch('http://localhost:3000/api/add-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ additionalInfo: validFields }),
            });

            const data = await res.json();
            if (res.status === 200 || res.ok) {
                console.log(data);
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
                dispatch(setFlashMessage({message:data.message,type:"success"}));
            } else if (res.status != 200) {
                console.log(data);
                dispatch(setFlashMessage({message:data.message,type:"error"}));
            }
        } catch (error) {
            dispatch(setFlashMessage({message:error.message,type:"error"}));
        } finally {
            setShowInfoForm(false);
            setLoading(false);
        }
    };

    return (
        <Form className="mt-3">
            {infoFields?.map((field, index) => (
                <Row key={index} className="mb-2 align-items-center">
                    <Col xs={4}>
                        <Form.Label className="text-capitalize">{field.type}</Form.Label>
                    </Col>
                    <Col xs={6}>
                        {field.type === 'UserType' ? (
                            <Form.Select
                                value={field.content}
                                onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                            >
                                <option value="Renter">Renter</option>
                                <option value="Buyer">Buyer</option>
                                <option value="Property Owner">Property Owner</option>
                                <option value="Agent">Agent</option>
                            </Form.Select>
                        ) : (
                            <Form.Control
                                type="text"
                                value={field.content}
                                placeholder={`Enter ${field.type}`}
                                onChange={(e) => handleFieldChange(index, 'content', e.target.value)}
                            />
                        )}
                    </Col>
                </Row>
            ))}
            <span>
                <Button variant="outline-secondary" onClick={() => setShowInfoForm(false)} className="me-2">
                    Cancel
                </Button>
                <Button className={loading ? 'disabled primary' : ''} variant={loading ? 'primary' : 'outline-primary'} onClick={handleSaveInfo}>
                    {loading ? <><FaCircle className='spinner-border' /> Saving</> : <><FaCheck /> Save</>}
                </Button>
            </span>
        </Form>
    )
}