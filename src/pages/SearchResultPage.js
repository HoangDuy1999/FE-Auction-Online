import Footer from '../components/Footer.js';
import NavigationBar from '../components/NavigationBar.js';
import { Container,Col,Row  } from 'react-bootstrap';
import SearchResult from '../components/SearchResult';

export default function SeacrhResultPage(props) {
    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                <NavigationBar/>
                <SearchResult/>
                <Footer/>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
};