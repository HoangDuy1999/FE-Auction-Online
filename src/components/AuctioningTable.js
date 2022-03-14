import { Modal, Container, Row, Button, Table, Form, FormControl } from 'react-bootstrap';
import { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { NotifyHelper } from '../helper/NotifyHelper';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
    getInfoProduct,
    selectInfoAuctioneers,
} from '../features/product/productSlice';
import { formatDateTime, formatPrice } from '../utils/utils';
import api from "../api/axiosClient"


export default function AuctioningTable() {
    const query = new URLSearchParams(useLocation().search);
    const id = query.get("productid");
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState();
    const [auctionId, setAuctionId] = useState();
    const [accountId, setAccountId] = useState();

    const infoAuctioneers = useSelector(selectInfoAuctioneers);
    const dispatch = useDispatch();
   

 

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = function () {

        let data = {
            auction_id: auctionId,
            account_id: accountId,
            reason: message
        };

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .post("http://localhost:3002/api/seller/product/reject_auction", data, config)
            .then(function (res) {
                console.log(res)
                if (res.status === 200) {
                    NotifyHelper.success(res.data.message, "Thông báo");
                    dispatch(getInfoProduct(id))
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
        setShow(false)

    };

    function handleChaneMessage(e) {
        setMessage(e.target.value);
    }

    useEffect(() => {
        dispatch(getInfoProduct(id));
    }, [dispatch, axios.post]);

    
    console.log(infoAuctioneers)
    return (

        <Container className='mt-3'>
            <h6>Danh sách người đang tham gia đấu giá</h6>
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Bidder</th>
                            <th>Thời điểm</th>
                            <th>Giá vào sản phẩm</th>
                            <th>Người giữ giá</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {infoAuctioneers ? infoAuctioneers.map((item => (
                            <tr key={item.auction_detail_id}>
                                <td>{item.bidder_id}</td>
                                <td>{formatDateTime(item.created_at)}</td>
                                <td>{formatPrice(item.cost)}</td>
                                <td>{item.bidder_name}</td>
                                <td className='d-flex jutify-content-center'>
                                    <Button className='m-auto' size='sm'
                                        disabled={!item.status}
                                        variant={item.status ? 'primary' : "secondary"}
                                        onClick={() => { setShow(true); setAccountId(item.bidder_id); setAuctionId(item.auction_id) }}>
                                        Từ chối</Button></td>
                            </tr>)

                        )) : null}
                    </tbody>
                </Table>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lý do từ chối</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="d-flex justify-content-around" >
                        <FormControl
                            type="text"
                            className="mr-2"
                            aria-label="Search"
                            name='message'
                            onChange={handleChaneMessage}
                        />
                        <div style={{ width: 10 }}></div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" type='submit' onClick={handleSubmit}>
                        Từ chối
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    );
}