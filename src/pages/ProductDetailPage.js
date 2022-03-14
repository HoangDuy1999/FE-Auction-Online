import Footer from '../components/Footer.js';
import NavigationBar from '../components/NavigationBar.js';
import ProductDetail from '../components/ProductDetail.js';
import { Container,Col,Row  } from 'react-bootstrap';

export default function ProductDetailPage(props) {
  

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                <NavigationBar/>
                <ProductDetail />
                <Footer/>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    ) 
};