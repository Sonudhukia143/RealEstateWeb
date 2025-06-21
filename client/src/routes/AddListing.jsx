import { useState } from 'react';
import { Container, Form, Row, Col, Button, Alert, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import "../../styles/profile.css";
import fetchData from '../utils/fetchData';
import { useNavigate } from 'react-router-dom';
import { setFlashMessage } from '../redux/flash/flashMessage';
import { fetchListings, setShouldFetchAllListingsTrue, setShouldFetchInitialListingsTrue, setShouldFetchListingsTrue } from '../redux/listing/listingAdded';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: {
      pincode: '',
      city: '',
      state: '',
      country: '',
    },
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [files, setFiles] = useState([]);
  const [fileUrl, setFileUrl] = useState([]);

  const user = useSelector((state) => state.user);
  const token = user.currentUser.token
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setFileChanges = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        Alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }
      setFiles(file);;
    }
  }

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id !== "rent" && id !== "sale" && id !== 'pincode' && id !== 'country' && id !== 'state' && id !== 'city') {
      setFormData((prevData) => ({
        ...prevData,
        [id]: (type === 'checkbox' && (id != "rent" && id != "sale")) ? checked : value,
      }));
    }
    if (type === 'checkbox' && (id === "rent" || id === "sale") && id !== 'pincode' && id !== 'country' && id !== 'state' && id !== 'city') {
      setFormData((prevData) => ({
        ...prevData,
        ['type']: (type === 'checkbox' && (id === "rent" || id === "sale")) ? id : prevData.type,
      }));
    }
    if (id === 'pincode' || id === 'country' || id === 'state' || id === 'city') {
      setFormData((prevData) => ({
        ...prevData,
        ['address']: {
          ...prevData.address,
          [id]: value
        }
      }))
    }
  }

  const uploadFiles = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetchData("/api/uploadImg", files, "UPLOADIMG", token);
      const data = await res.json();

      setFileUrl((prevUrls) => [...prevUrls, data.url]);
      setFormData(prevData => ({
        ...prevData,
        imageUrls: [...prevData.imageUrls, data.url],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
    }
  }

  const removeFile = (index) => {
    setFileUrl((prevUrls) => prevUrls.filter((i) => i !== fileUrl[index]));
    setFormData(prevData => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((i) => i !== fileUrl[index]),
    }));
  }

  const saveListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchData("/api/add-listing", formData, "CREATELISTING", token);
      const data = await res.json();

      if (res.status == 200) {
        setFormData({
          imageUrls: [],
          name: '',
          description: '',
          address: {
            pincode: '',
            city: '',
            state: '',
            country: '',
          },
          type: 'rent',
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 50,
          discountPrice: 0,
          offer: false,
          parking: false,
          furnished: false,
        });
        setFileUrl([]);
        setFiles([]);
        dispatch(setFlashMessage({ message: data.message, type: "success" }));
        navigate(`/listing/${data.listingId}`); // Redirect to the newly created listing
        dispatch(setShouldFetchListingsTrue()); // Trigger a fetch for listings
        dispatch(fetchListings(null)); // Clear the current listings in the store
        dispatch(setShouldFetchAllListingsTrue());
        dispatch(setShouldFetchInitialListingsTrue());
      } else {
        dispatch(setFlashMessage({ message: data.message, type: "error" }));
      }
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="bg-dark text-light p-4 rounded" id="container">
      <h1 className="text-center mb-4">Create a Listing</h1>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                maxLength="62"
                minLength="10"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                id="description"
                rows={3}
                required
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Row className="g-2"> {/* g-2 adds gap between inputs */}
                <Col xs={12} md={6}>
                  <input
                    type="text"
                    name="pincode"
                    id="pincode"
                    className="form-control"
                    required
                    value={formData.address.pincode}
                    onChange={handleChange}
                    placeholder="PINCODE ..In Numbers"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-control"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="CITY"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    className="form-control"
                    required
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="STATE"
                  />
                </Col>
                <Col xs={12} md={6}>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className="form-control"
                    required
                    value={formData.address.country}
                    onChange={handleChange}
                    placeholder="COUNTRY"
                  />
                </Col>
              </Row>
            </Form.Group>


            <Row className="mb-3">
              <Col>
                <Form.Check
                  type="checkbox"
                  id="sale"
                  label="Sell"
                  checked={formData.type === 'sale'}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  id="rent"
                  label="Rent"
                  checked={formData.type === 'rent'}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  id="parking"
                  label="Parking Spot"
                  checked={formData.parking}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  id="furnished"
                  label="Furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Check
                  type="checkbox"
                  id="offer"
                  label="Offer"
                  checked={formData.offer}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  required
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
                <Form.Label>Beds</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  required
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
                <Form.Label>Baths</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  id="regularPrice"
                  min="50"
                  max="10000000"
                  required
                  value={formData.regularPrice}
                  onChange={handleChange}
                />
                <Form.Label>
                  Regular Price {formData.type === 'rent' && <small>($ / month)</small>}
                </Form.Label>
              </Col>
              {formData.offer && (
                <Col>
                  <Form.Control
                    type="number"
                    id="discountPrice"
                    min="0"
                    max="10000000"
                    required
                    value={formData.discountPrice}
                    onChange={handleChange}
                  />
                  <Form.Label>
                    Discounted Price {formData.type === 'rent' && <small>($ / month)</small>}
                  </Form.Label>
                </Col>
              )}
            </Row>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Images <small className="text-muted">(Max 6 – first will be cover)</small>
              </Form.Label>
              <Row className="g-2">
                <Col xs={9}>
                  <Form.Control
                    name='img'
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={setFileChanges}
                  />
                </Col>
                <Col>
                  <Button
                    variant="outline-success"
                    type="button"
                    onClick={uploadFiles}
                    className={loading ? 'disabled' : ''}
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </Button>

                </Col>
              </Row>
            </Form.Group>
            {
              fileUrl.length > 0
              &&
              fileUrl.map((url, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between mb-2 border p-2 rounded"
                >
                  <Image src={url} alt="listing" thumbnail style={{ width: '80px', height: '80px' }} />
                  <Button variant="danger" size="sm" onClick={() => removeFile(index)} className={loading ? 'disabled' : ''}>
                    Remove
                  </Button>
                </div>

              ))}
          </Col>
        </Row>

        <div className="text-center mt-4">
          {
            <Button variant="primary" type="submit" disabled={loading} onClick={saveListing} className={loading ? 'disabled' : ''}>
              {loading ? 'Creating...' : 'Create Listing'}   {/* use uploading as another useState variable latter on */}
            </Button>
          }
        </div>
      </Form>

    </Container>
  );
}