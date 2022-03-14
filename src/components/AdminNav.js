import { Nav, Navbar } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import { useHistory } from "react-router";

export default function AdminNav() {
    const history = useHistory();

    const handleLogout = function (e) {
        e.preventDefault();
        delete localStorage.x_accessToken;
        delete localStorage.x_refreshToken;
        history.push('/login')
      }

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Collapse id="responsive-navbar-nav">
                <div style={{ width: 10 }}></div>
                <LinkContainer to="/"><Navbar.Brand href="/">OnAution</Navbar.Brand></LinkContainer>
                <Nav className="me-auto">
                    <LinkContainer to="/admin/category"><Nav.Link >Danh mục</Nav.Link></LinkContainer>
                    <LinkContainer to="/admin/product"><Nav.Link >Sản phẩm</Nav.Link></LinkContainer>
                    <LinkContainer to="/admin/seller"><Nav.Link >Seller</Nav.Link></LinkContainer>
                    <LinkContainer to="/admin/bidder"><Nav.Link >Bidder</Nav.Link></LinkContainer>
                    <LinkContainer to="/admin/upgrade"><Nav.Link >Chờ duyệt</Nav.Link></LinkContainer>
                </Nav>
                <Nav className="mr-5">
                    <LinkContainer to="#"><Nav.Link className="mr-1"> < FaUser /></Nav.Link></LinkContainer>
                    <LinkContainer to='/' onClick={handleLogout} ><Nav.Link ><FaSignOutAlt  className='m-2'/></Nav.Link></LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}