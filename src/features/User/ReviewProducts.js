
import { Tabs, Tab, Col, Row, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Review from '../../components/Review';
import UserNavBar from '../../components/UserNavBar';
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from 'jwt-decode';
import Footer from '../../components/Footer';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';
import { getReviews,selectReviews } from './UserSlice';

export default function ReviewProduct() {
    const reviews = useSelector(selectReviews);
    const dispatch = useDispatch();
    const [buyer, setBuyer] = useState(true);
    const userId = jwt_decode(localStorage.x_accessToken).account_id;

    useEffect(() => {

        if (Number(userId)) {
           dispatch(getReviews(userId));
        }

        if (localStorage.x_accessToken) {
            jwt_decode(localStorage.x_accessToken).role_id === 2 ? setBuyer(false) : setBuyer(true);
        }
    }, []);

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <h5 className="d-flex justify-content-center mt-4">Các đánh giá!</h5>
                    {
                        reviews && reviews.length > 0 ?
                            reviews.map((item) =>
                                (<Review item={item} key={item.evaluation_id} />))
                            : <h6 className="d-flex justify-content-center mt-4">Chưa có đánh giá nào!</h6>
                    }
                    <Footer />
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );
}
