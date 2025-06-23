import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout, signInStart } from '../redux/user/userSlice.js';
import { setFlashMessage } from '../redux/flash/flashMessage.js';
import Loader from '../helperComponents/Loader.jsx';

export default function NavBar() {
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  const signOut = async () => {
    dispatch(signInStart());
    try {
      const res = await fetch("https://bank-website-23d3.vercel.app/api/logout", {
        method: 'POST',
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok || res.status == 200) {
        dispatch(logout());
        dispatch(setFlashMessage({ message: data.message, type: "success" }));
      }
      else if (!res.ok) {
        dispatch(setFlashMessage({ message: "Unable to logout", type: "warning" }))
      }
    } catch (err) {
      dispatch(signInError("Unexpected Error Occured"));
      dispatch(setFlashMessage({ message: "Unexpected error occurred. Please try again.", type: "danger" }));
    }
  }

  return (
    <>
      {userState.loading && <Loader props={"Clearing Session"} />}
      <Navbar className="navb" id="navbar" expand="md">
        <Container className="container" fluid>
          <Navbar.Brand as={Link} to="/"><b style={{ color: "grey" }}>Maisen</b>Monde</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <span className="navlinks">
                <Nav.Link as={Link} to="/about">About</Nav.Link>
                {
                  userState?.currentUser?.user?.username
                    ?
                    <>
                      <Nav.Link as={Link} onClick={signOut}>Logout</Nav.Link>
                      <Nav.Link as={Link} to="/listings">Listings</Nav.Link>
                      <Nav.Link as={Link} to="/profile"><img className="profilePic"
                        src={
                          userState?.currentUser?.user?.profile
                            ?
                            userState?.currentUser?.user?.profile
                            :
                            'assets/profile.webp'}
                        alt="ProfileImg" >
                      </img>
                      </Nav.Link>
                    </>
                    :
                    <>
                      <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                      <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    </>
                }
              </span>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  )
}
