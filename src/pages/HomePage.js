import Footer from '../components/Footer.js';
import Home from '../components/Home.js';
import NavigationBar from '../components/NavigationBar.js';
import { Container,Col,Row  } from 'react-bootstrap';

export default function HomePage(props) {
   
    return (
        <Container>
            <Row>
                <Col ></Col>
                <Col xs={8} >
                <NavigationBar/>
                <Home/>
                <Footer/>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
};