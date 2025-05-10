import { Navbar, Nav, Container } from 'react-bootstrap';
import { useUserContext } from '../contexts/UserContext';

/**
 * The navigation bar showed at the top of all pages, allows user
 * to view recipes, cupboard and login/logout.
 * 
 * @returns {JSX.Element} - Navigation bar.
 */
export default function Navigation() {
    const { loggedIn } = useUserContext();

    return <Navbar expand="sm" bg="dark" data-bs-theme="dark">
        <Container fluid>
            <Navbar.Brand>Recipe Manager</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse>
                <Nav className='me-auto'>
                    <Nav.Link href='/recipes'>Recipes</Nav.Link>
                    <Nav.Link href='/cupboard'>Cupboard</Nav.Link>
                </Nav>
                <Nav>
                    {loggedIn && <Nav.Link href='/logout'>Logout</Nav.Link>}
                    {!loggedIn && <Nav.Link href='/login'>Login</Nav.Link>}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}