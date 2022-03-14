import Category from '../components/Category.js';
import Footer from '../components/Footer.js';
import NavigationBar from '../components/NavigationBar.js';
import { Container,Col,Row  } from 'react-bootstrap';


export default function HomePage(props) {
    
    return (
        <Container>
        <Row>
            <Col></Col>
            <Col xs={8} >
            <NavigationBar/>
            <Category/>
            <Footer/>
            </Col>
            <Col></Col>
        </Row>
    </Container>
    ) 
};