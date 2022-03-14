import { Tabs, Tab, Col, Row,Container } from 'react-bootstrap';
import ProductAutioning from '../../components/ProductAutioning';
import ProductShefing from '../../components/ProductShefing';
import UserNavBar from '../../components/UserNavBar';
import { useSelector, useDispatch } from "react-redux";
import { 
    selectUser, 
    getUserInfo,
    selectSoldProducts,
    getSoldProducts,

 } from './UserSlice';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import SoldCard from '../../components/SoldCard';

export default function SoldProducts() {
    const dispatch = useDispatch();
    const soldProducts = useSelector(selectSoldProducts);

    useEffect(() => {
        if(localStorage.x_accessToken){
            dispatch(getSoldProducts());
        }
    }, [dispatch])

    console.log(soldProducts)
    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <h5 className="d-flex justify-content-center mt-4">Sản phẩm đã bán được!</h5>
                    <div className="card mb-3 mt-4 no-gutters" >
                        <div className="row no-gutters">
                            {soldProducts && soldProducts.length > 0 ?
                                <Row xs={1} md={5} className="g-4 m-auto mb-3" >
                                    {soldProducts.map((item) => (
                                        <SoldCard key={item.product_id} item={item}>
                                        </SoldCard>
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