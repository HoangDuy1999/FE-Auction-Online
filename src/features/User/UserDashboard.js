import { Card, Row, Col } from 'react-bootstrap';
import UserNavBar from '../../components/UserNavBar';
export default function UserDashboard() {


    return (
        <Row>
            <Col></Col>
            <Col xs={8}>
                <UserNavBar />
                <h2 className="d-flex justify-content-center mt-4">Chào mừng bạn đến!</h2>
            </Col>
            <Col></Col>
        </Row>

    )
}