import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import {
    selectTypeInfo,
    getTypeInfo,
    
} from '../features/product/typeSlice';
import { useHistory } from "react-router";
import { selectUser, setUser } from "../features/User/UserSlice";
import jwt_decode from "jwt-decode";


export default function NavigationBar() {
    const typeInfo = useSelector(selectTypeInfo);
    const history = useHistory();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
   
    const handleClick = function (e) {
        e.preventDefault();
        
        if(localStorage.x_accessToken){
            
            const role_id = jwt_decode(localStorage.x_accessToken).role_id;
           
            
            switch(role_id){
                case 1:
                case 2:
                    history.push("/user/favorite");
                    break;
                case 3:
                    history.push("/admin");
                    break;
                default:
                    break;
            }
        }
        else{
            history.push("/login")
        }
    }
    

    function handleSearch(e){
        e.preventDefault()
        e.stopPropagation();
        const search = e.target.search.value;

        if(search.length > 2){
            history.push(`/product/search?search=${search}`);
        }
        
    }
      
    useEffect(() => {
        dispatch(getTypeInfo());
    }, [dispatch]);
   
    return (
        <>
            <Navbar bg="light" expand="lg">
                <div className='p-3' style={{ width: 10 }}></div>
                <LinkContainer to='/'><Navbar.Brand className="mr-auto ">OnAution</Navbar.Brand></LinkContainer>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">

                </Navbar.Collapse>
                <Form className="d-flex justify-content-around" onSubmit={handleSearch}>
                    <FormControl
                        type="search"
                        placeholder="Tìm kiếm"
                        className="mr-2"
                        aria-label="Search"
                        name='search'
                    />
                    <div style={{ width: 10 }}></div>
                    <Button variant="outline-success" type='submit'>Tìm</Button>
                </Form>
                
                <LinkContainer to='/' onClick={handleClick} ><Nav.Link ><FaShoppingCart  className='m-2'/></Nav.Link></LinkContainer>
            </Navbar>
            <Navbar bg="dark" variant="dark" expand="lg">
                <div style={{ width: 10 }}></div>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mr-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        {typeInfo ? typeInfo.map((type) =>
                            <NavDropdown title={type.types.name} id="navbarScrollingDropdown" key={type.types.type_id}>
                                {type.categories ? type.categories.map((category) =>
                                    <LinkContainer title={category.name} to={`/category/${category.category_id}`} key={category.category_id}>
                                        <NavDropdown.Item >{category.name}</NavDropdown.Item>
                                    </LinkContainer>

                                ) : null}

                            </NavDropdown>
                        ) : null}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
};