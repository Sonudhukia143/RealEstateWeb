import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import { Navbar, Nav, Container } from 'react-bootstrap'; // Import React-Bootstrap components

export default function NavBar() {

    return (
        <Navbar style={{ backgroundColor: '#e5e7eb', boxShadow:"0px 2px 4px 1px grey", padding:"2vh" }} expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/"><b style={{color:"grey"}}>Maisen</b>Monde</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}