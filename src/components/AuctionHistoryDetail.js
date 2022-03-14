import { Modal, Container, Row, Button, Table, Form, FormControl } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NotifyHelper } from '../helper/NotifyHelper';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {

    getInfoProduct,
    selectInfoAuctioneers,
    selectInfoProduct
} from '../features/product/productSlice';
import { formatDateTime, formatPrice, formatBiddertName } from '../utils/utils';



export default function AuctionHistoryDetail() {
    const query = new URLSearchParams(useLocation().search);
    const id = query.get("productid");
    const [show, setShow] = useState(false);
 
    const infoAuctioneers = useSelector(selectInfoAuctioneers);
    const dispatch = useDispatch();
    

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    

    useEffect(() => {
        dispatch(getInfoProduct(id));
    }, [dispatch]);
    
    console.log(infoAuctioneers)
    return (

        <Container className='mt-3'>
            <h6>Danh sách người đã tham gia đấu giá</h6>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Thời điểm</th>
                            <th>Giá vào sản phẩm</th>
                            <th>Người mua</th>
                        </tr>
                    </thead>
                    <tbody>
                        {infoAuctioneers ? infoAuctioneers.map((item => (
                            <tr key={item.auction_detail_id}>
                                <td>{formatDateTime(item.created_at)}</td>
                                <td>{formatPrice(item.cost)}</td>
                                <td><a href={`/reviews/${item.bidder_id}`}>{formatBiddertName(item.bidder_name) }</a></td>
                            </tr>)

                        )) : null}
                    </tbody>
                </Table>
            </Row>
        </Container>

    );
}