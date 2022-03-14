
import { Tabs, Tab, Col, Row, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Review from '../components/Review';
import { useSelector, useDispatch } from "react-redux";
import jwt_decode from 'jwt-decode';
import Footer from '../components/Footer';
import { getPublicReviews, selectPublicReviews } from '../features/User/UserSlice';
import NavigationBar from '../components/NavigationBar';
import { useParams } from 'react-router';

export default function ViewInfoReviewPage() {
    const reviews = useSelector(selectPublicReviews);
    const dispatch = useDispatch();

    const { accountid } = useParams();

    useEffect(() => {

        
           dispatch(getPublicReviews(accountid));
        
    }, []);

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <NavigationBar />
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
