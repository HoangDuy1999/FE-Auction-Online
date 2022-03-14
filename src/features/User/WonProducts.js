import { Tabs, Tab, Col, Row, Container } from 'react-bootstrap';
import ProductAutioning from '../../components/ProductAutioning';
import ProductShefing from '../../components/ProductShefing';
import UserNavBar from '../../components/UserNavBar';
import { useSelector, useDispatch } from "react-redux";
import { selectUser, getUserInfo, selectWonProducts, getWonProducts } from './UserSlice';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import WonCard from '../../components/WonCard';

export default function WonProducts() {
    const dispatch = useDispatch();
    const wonProducts = useSelector(selectWonProducts);

    useEffect(() => {
        if (localStorage.x_accessToken) {
            dispatch(getWonProducts());
        }
    }, [dispatch])

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <h5 className="d-flex justify-content-center mt-4">Sản phẩm đã thắng!</h5>
                    <div className="card mb-3 mt-4 no-gutters" >
                        <div className="row no-gutters">
                            {wonProducts && wonProducts.length > 0 ?
                                <Row xs={1} md={5} className="g-4 m-auto mb-3" >
                                    {wonProducts.map((item) => (
                                        <WonCard key={item.product_id} item={item}>
                                        </WonCard>
                                    ))}
                                </Row>
                                : <h6 className='d-flex justify-content-center'>Không có sản phẩm!</h6>}
                        </div>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}