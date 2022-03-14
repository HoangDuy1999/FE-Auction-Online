import { Tabs, Tab, Col, Row,Container } from 'react-bootstrap';
import SellerAutionHistory from '../../components/SellerAutionHistory';
import BidderAutionHistory from '../../components/BidderAutionHistory';
import UserNavBar from '../../components/UserNavBar';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, getUserInfo } from './UserSlice';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export default function AutionProductsHistory() {
    const dispatch = useDispatch();
    const [buyer, setBuyer] = useState(true);


    useEffect(() => {
        if(localStorage.x_accessToken){
            jwt_decode(localStorage.x_accessToken).role_id === 2 ?  setBuyer(false): setBuyer(true);
        }

    }, [dispatch])

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <Tabs defaultActiveKey="buyer" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="buyer" title="Mua">
                            <h5 className="d-flex justify-content-center mt-4">Lịch sử sản phẩm bạn đã tham gia đấu giá!</h5>
                            <SellerAutionHistory />
                        </Tab>
                        <Tab eventKey="seller" title="Bán" disabled={buyer}>
                            <h5 className="d-flex justify-content-center mt-4">Lịch sử sản phẩm bạn trưng bày đấu giá!</h5>
                            <BidderAutionHistory />
                        </Tab>
                    </Tabs>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}