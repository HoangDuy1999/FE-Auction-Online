
import { useState, useEffect, useRef } from 'react';
import { Image, Row, Col, Button, Modal, Form, FormControl, Carousel, Table } from 'react-bootstrap';
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineHistory } from "react-icons/ai";
import { ImHammer2 } from "react-icons/im";
import AutionHistory from './AuctioningTable';
import ProductCard from './ProductCard';
import ReactHtmlParser from "react-html-parser";
import { formatDateTime, formatProductName, formatPrice, formatEndDay, formatBiddertName } from '../utils/utils';
import { addWatchList, removeWatchList } from '../features/User/UserSlice';
import {
    selectRelationProduct,

} from '../features/product/productSlice';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { NotifyHelper } from '../helper/NotifyHelper';
import socketIOClient from "socket.io-client";
import jwt_decode from 'jwt-decode';
import AuctioningTable from './AuctioningTable';
import AuctionHistoryDetail from './AuctionHistoryDetail';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';

const styles = {
    card: {
        //backgroundColor: '#B7E0F2',
        borderRadius: 5,
        width: '8.8rem'
    },
    cardImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        maxHeight: '20rem',
    },
    cardTitle: {
        fontSize: '0.8rem',
    },
    cardBody: {
        width: '8.8rem'
    },
    cardText: {
        fontSize: '0.6rem'
    }
}

export default function ProductDetail({ props, }) {
    const [infoProduct, setInfoProduct] = useState();
    const [isRefresh, setIsRefresh] = useState(false);
    const [realationProduct, setRealationProduct] = useState();
    const dispatch = useDispatch();
    const location = useLocation();

    const [watchList, setWatchList] = useState();
    const [validUser, setValidUser] = useState(false);
    const [winner, setWinner] = useState();
    const [evaluated, setEvaluated] = useState();
    const [data, setData] = useState();
    const [validatedAuction, setValidatedAuction] = useState(false);
    const [auctionPrice, setAuctionPrice] = useState();

    //ower
    const [owner, setOwner] = useState();

    //evaluation
    const [show, setShow] = useState(false);
    const [showAcceptAuctionModal, setShowAcceptAuctionModal] = useState(false);
    const handleCloseAcceptAuctionModal = () => setShowAcceptAuctionModal(false);
    const [message, setMessage] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [auctionId, setAuctionId] = useState();
    const [accountId, setAccountId] = useState();
    const [isThumbsUp, setIsThumbsUp] = useState(true);

    //get id
    const query = new URLSearchParams(useLocation().search);
    const id = query.get("productid");
    const [like, setlike] = useState();

    // aution history list
    const [autionHistoryList, setAutionHistoryList] = useState();

    // current cost
    const [currentCost, setCurrentCost] = useState();

    //endday
    const [isEndday, setEndday] = useState();

    //socket
    const host = "http://localhost:3002";
    const [connect, setConnect] = useState(true);
    const socketRef = useRef();
    const querySocket = {
        query: {
            token: localStorage.x_accessToken ? localStorage.x_accessToken : null
        }
    }


    function handleLike(e) {

        if (like) {
            dispatch(removeWatchList(id));
            setlike(false);

        }
        else {

            dispatch(addWatchList(Number(id)));
            setlike(true);

        }
    }


    //call api --------------------------------------------------------------------------------------->
    function getWatchList() {

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get("http://localhost:3002/api/bidder/watch_list", config)
            .then(function (res) {
                if (res.status === 200) {

                    setWatchList(res.data.watch_list);
                    if (res.data.watch_list.some(item => Number(id) === item.product_id))
                        setlike(true);
                }

            })
            .catch(function (error) {
                NotifyHelper.error(error, "Thông báo");
            });
    }

    function getEvaluationBidder(id) {
        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get(`http://localhost:3002/api/bidder/product/evaluation?seller_id=${id}`, config)
            .then(function (res) {
                //console.log(res)
                if (res.status === 200) {
                    if (res.data.description) {
                        setEvaluated(true);
                    } else {
                        setEvaluated(false);
                    }

                }

            })
            .catch(function (error) {
                NotifyHelper.error(error.message, "Thông báo");
            });
    }

    const handleSubmit = function () {

        let data = {
            account_id: accountId,
            auction_id: auctionId,
            description: message,
            score: isThumbsUp ? 1 : -1
        };
        //console.log(data)
        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .post("http://localhost:3002/api/evaluation_historys", data, config)
            .then(function (res) {
                if (res.status === 200) {
                    NotifyHelper.success(res.data.message, "Thông báo");
                    setEvaluated(true)
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
                setEvaluated(true)
            });
        setShow(false)

    };

    function getInfoProduct() {
        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get(`http://localhost:3002/api/products/info/${id}`, config)
            .then(function (res) {
                console.log(res.data)
                if (res.status === 200) {
                    setInfoProduct(res.data.infoProduct)
                    setRealationProduct(res.data.relation_product)
                    const cCost = res.data.infoProduct.current_cost ? res.data.infoProduct.current_cost : res.data.infoProduct.start_cost;
                    const sCost = cCost + res.data.infoProduct.step_cost;

                    setData({
                        ...res.data.infoProduct,
                        created_at: formatDateTime(res.data.infoProduct.created_at),
                        start_day: formatDateTime(res.data.infoProduct.start_day),
                        buy_now: formatPrice(res.data.infoProduct.buy_now),
                        start_cost: formatPrice(res.data.infoProduct.start_cost),
                        current_cost: res.data.infoProduct.current_cost ? formatPrice(res.data.infoProduct.current_cost) : formatPrice(res.data.infoProduct.start_cost),
                        end_day: formatEndDay(res.data.infoProduct.end_day),
                        suggest_cost: formatPrice(sCost),
                        holder: res.data.infoProduct.bidder_name ? formatBiddertName(res.data.infoProduct.bidder_name) : "Chưa có"
                    })
                    const isEndAuction = Date.now() - new Date(res.data.infoProduct.end_day).getTime()
                    if(isEndAuction < 0){
                        setEndday(false)
                    }else{
                        setEndday(true)
                    }
                }

            })
            .catch(function (error) {
                console.log(error.message)
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }
    //hanlde ----------------------------------------------------------------------------------------->


    function actionAuction() {
        setShowAcceptAuctionModal(false);
        if (socketRef.current.connected) {
            const auctionCost = auctionPrice ? auctionPrice : 0;
            socketRef.current.emit("dau_gia_san_pham", { product_id: Number(id), cost: auctionCost });
        } else {
            // console.log("không thể kết nối đến server");
            NotifyHelper.error("Phiên hoạt động đáu giá của bạn đã hết hạn! Cần đăng nhập lại để thựch hiện thao tác", 'Thông báo');
        }
    }

    function handleBuynow() {
        if (socketRef.current.connected) {
            // thông tin đấu giá gửi lên server
            socketRef.current.emit("mua_ngay", { product_id: Number(id), cost: infoProduct.buy_now });
        } else {
            // console.log("không thể kết nối đến server");
            NotifyHelper.error("Phiên hoạt động đáu giá của bạn đã hết hạn! Cần đăng nhập lại để thựch hiện thao tác", 'Thông báo');
        }
    }

    function handleChaneMessage(e) {
        setMessage(e.target.value);
    }

    function handleIsValuate() {

        setIsThumbsUp(!isThumbsUp);
    }

    function handleAuction(e) {
        e.preventDefault();
        e.stopPropagation();


        const form = e.currentTarget;
        if (form.checkValidity()) {
            setShowAcceptAuctionModal(true);
            setAuctionPrice(e.target.auctionPrice.value);
        }
        setValidatedAuction(true);
    }

    function handleRejectTransaction() {
        setMessage("Không thanh toán sản phẩm");
        setIsThumbsUp(false);
        handleSubmit();
    }

    //-------------------------------------------------------------------------------------------------------------------->
    useEffect(() => {

        if (id && id > 0)
            getInfoProduct();
    }, [location, autionHistoryList, isRefresh]);

    useEffect(() => {
        getInfoProduct();
    }, [ isRefresh]);

    useEffect(() => {
        if (localStorage.x_accessToken && data) {
            setValidUser(true);
            getWatchList();
            jwt_decode(localStorage.x_accessToken).account_id === data.seller_id ? setOwner(true) : setOwner(false);
            jwt_decode(localStorage.x_accessToken).account_id === data.bidder_id ? setWinner(true) : setWinner(false);
            if (data.compare_day < 0) {
                getEvaluationBidder(data.bidder_id);
            }
        }

    }, [data]);

    useEffect(() => {
        if (localStorage.x_accessToken) {

            socketRef.current = socketIOClient.connect('http://localhost:3002', {
                query: {
                    token: localStorage.x_accessToken ? localStorage.x_accessToken : null
                }
            });

            socketRef.current.on("ket_qua_dau_gia_nguoi_mua", (res) => {
                if (localStorage.x_accessToken && res.account_id === jwt_decode(localStorage.x_accessToken).account_id) {
                    if (res.status === 200) {
                        NotifyHelper.success(res.message, 'Thông báo')
                        setIsRefresh(!isRefresh);
                    }
                    else {
                        NotifyHelper.error(res.message, 'Thông báo')
                    }
                }
            });

            socketRef.current.on("ket_qua_dau_gia_nguoi_mua_ngay", (res) => {
                if (localStorage.x_accessToken && res.account_id === jwt_decode(localStorage.x_accessToken).account_id) {
                    if (res.status === 200) {
                        NotifyHelper.success(res.message, 'Thông báo')
                        setIsRefresh(!isRefresh);
                    }
                    else {
                        NotifyHelper.error(res.message, 'Thông báo')

                    }
                }


            });

            socketRef.current.on("cap_nhat_giao_dien_xem_chi_tiet_san_pham_nguoi_ban", (res) => {
                //console.log(res)
                if (localStorage.x_accessToken && res.account_id === jwt_decode(localStorage.x_accessToken).account_id) {
                    setAutionHistoryList(res.info_auction_detail)
                    setIsRefresh(!isRefresh);
                }
            });

            socketRef.current.on("thong_tin_dau_gia", (data) => {
                //console.log(data);
                setAutionHistoryList(data)
            });


            if (socketRef.current.connected)
                socketRef.current.emit("lay_thong_tin_dau_gia", { product_id: 2 });

            return () => {
                socketRef.current.disconnect();
            };
        }

    }, []);


    useEffect(() => {
    }, [infoProduct, watchList]);

    return (
        <>
            <div className="card mb-3 mt-4 no-gutters" >
                <div className="row no-gutters">
                    {data ?
                        <Row >
                            <Col className="col-md-4 m-2">
                                <Row >
                                    <title>Placeholder</title>

                                    {/* <Image src={data.image ? data.image[0] : ''} style={styles.cardImage} /> */}
                                    <Carousel>
                                        <Carousel.Item interval={500}>
                                            <img
                                                className="d-block w-100"
                                                src={data.image ? data.image[0] : ''}
                                                alt="First slide"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item interval={1000}>
                                            <img
                                                className="d-block w-100"
                                                src={data.image ? data.image[1] : ''}
                                                alt="First slide"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item interval={500}>
                                            <img
                                                className="d-block w-100"
                                                src={data.image ? data.image[2] : ''}
                                                alt="Second slide"
                                            />
                                        </Carousel.Item>
                                        <Carousel.Item>
                                            <img
                                                className="d-block w-100"
                                                src={data.image ? data.image[3] : ''}
                                                alt="Third slide"
                                            />
                                        </Carousel.Item>
                                    </Carousel>
                                </Row>
                                <div style={{ height: 10 }}></div>
                                <Row xs={1} md={3} className="m-1">
                                    <Image
                                        src={data.image ? data.image[1] : ''} fluid />
                                    <Image
                                        src={data.image ? data.image[2] : ''} fluid />
                                    <Image
                                        src={data.image ? data.image[3] : ''} fluid />

                                </Row>
                                <div style={{ height: 20 }}></div>
                                <Row>
                                    {
                                        validUser ?
                                            <p role='button' className='d-flex justify-content-center' onClick={handleLike}>
                                                {like ? <AiFillHeart style={{ color: 'red' }} /> : <AiOutlineHeart />}
                                            </p>
                                            : null
                                    }
                                </Row>
                            </Col >
                            <Col className="col-md-7 m-2">
                                <div >
                                    <div className="card-body">
                                        <h5 className="card-title">{data.name}
                                        </h5>
                                        <p className="card-text">
                                            Giá hiện tại: {data.current_cost} <br />
                                            Người giữ giá: {data.holder ? data.holder : "Chưa có"}<br />
                                            {validUser ?
                                                (data.buy_now ?
                                                    <>
                                                        <Button className='m-2 ' onClick={handleBuynow} variant="success" disabled={isEndday}> 
                                                        <AiOutlineShoppingCart></AiOutlineShoppingCart>&nbsp; Mua ngay
                                                        </Button> {data.buy_now}
                                                    </>
                                                    : null)

                                                : null}
                                            <br />
                                            Người bán: {data.seller_name} &nbsp;&nbsp;&nbsp;&nbsp;  
                                            Đánh giá: <a href={`/reviews/${data.seller_id}`}>{data.evaluation_score}</a> điểm
                                            <br />
                                            {/* Đăng: {data.created_at}
                                            <br /> */}
                                            Bắt đầu: <br />{data.start_day}
                                            <br />
                                            {/* Kết thúc: <a role='text' style={{ textDecoration: 'none' }} className="text-danger">{data.end_day}</a> */}
                                            {ReactHtmlParser(data.end_day)}
                                        </p>

                                        {validUser ?
                                            <>
                                                {/* <Button className='mb-2' variant="info" onClick={() => setModalShow(true)}> <AiOutlineHistory /> &nbsp;Lịch sử
                                                </Button> */}
                                                <Col md={4}>
                                                    <span><i>Giá đề xuất: {data.suggest_cost}</i>   </span>
                                                    <Form className='p-2' noValidate validated={validatedAuction} onSubmit={handleAuction} method="post" >
                                                        <Form.Group as={Col} controlId="validationCustom01">
                                                            <Form.Label column="sm">Ra giá đấu giá</Form.Label>
                                                            <Form.Control size="sm"
                                                                required
                                                                type="number"
                                                                defaultValue=""
                                                                name="auctionPrice"
                                                                min={100000}
                                                                max={100000000}
                                                            // onChange={handleEmail}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Thấp nhất: 100,000 và  cao nhất: 100,000,000
                                                            </Form.Control.Feedback>
                                                            <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Button  disabled={isEndday} className='mb-2 mt-2' type='submit' variant="warning"> <ImHammer2 /> &nbsp;Đấu giá
                                                        </Button>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                    </Form>

                                                </Col>
                                            </>
                                            : null}
                                        <br /><br />
                                        <b >Thông tin sản phẩm</b>
                                        {ReactHtmlParser(data.description)}
                                    </div>
                                </div>
                            </Col >
                        </Row>
                        : <h6 className='d-flex justify-content-center'>Không có sản phẩm!</h6>
                    }
                    {
                        data && data.compare_day < 0 ?

                            <Row className='m-auto'>
                                {owner ?
                                    <Row className='m-3'>
                                        <h6>Thông tin người chiến thắng:</h6>
                                        <span>Id: {data.bidder_id}</span>
                                        <span>Tên: {data.bidder_name}</span>
                                        {
                                            !evaluated ?
                                                <Button className="col-md-2 m-3" size="sm"
                                                    onClick={() => {
                                                        setShow(true);
                                                        setAccountId(data.bidder_id);
                                                        setAuctionId(data.auction_id)
                                                    }}
                                                    variant="primary">
                                                    Đánh giá
                                                </Button>
                                                : null
                                        }
                                        {
                                            !evaluated ?
                                                <Button className="col-md-2 m-3" size="sm"
                                                    onClick={() => {
                                                        setAccountId(data.bidder_id);
                                                        setAuctionId(data.auction_id);
                                                        handleRejectTransaction();
                                                    }}
                                                    variant="primary">
                                                    Từ chối GD
                                                </Button>
                                                : null
                                        }

                                    </Row>
                                    : null
                                }

                                {
                                    winner ?
                                        <Row className='m-3'>
                                            <h6>Thông tin người chiến thắng:</h6>
                                            <span>Id: {data.bidder_id}</span>
                                            <span>Tên: {data.bidder_name}</span>
                                            {
                                                !evaluated ?
                                                    <Button className="col-md-2 m-3" size="sm"
                                                        onClick={() => {
                                                            setShow(true);
                                                            setAccountId(jwt_decode(localStorage.x_accessToken).account_id);
                                                            setAuctionId(data.auction_id)
                                                        }}
                                                        variant="primary">
                                                        Đánh giá
                                                    </Button>
                                                    : null
                                            }
                                        </Row>
                                        : null
                                }
                                <Col md='12'>
                                    <AuctionHistoryDetail />
                                </Col>
                            </Row>
                            : null
                    }
                    {
                        data && owner && data.compare_day > 0 ?
                            <Row className='m-auto'>
                                <Col>
                                    <AuctioningTable />
                                </Col>
                            </Row>

                            : null
                    }
                    {/* <Row className='m-auto'>
                        <Row className='m-3'>
                            <h6>Thông tin người chiến thắng:</h6>
                            <span>Id: {data.bidder_id}</span>
                            <span>Tên: {data.bidder_name}</span>
                            <Button className="col-md-2 m-3" size="sm"
                                onClick={() => { setShow(true); }}
                                variant="primary">
                                Đánh giá
                            </Button>
                        </Row>
                        <Col md='12'>
                            <AuctionHistoryDetail />
                        </Col>
                    </Row> */}
                    
                </div>

            </div>
            <h5 >Sản phẩm cùng mục</h5>
            <div className="card mb-3 mt-4 no-gutters" >
                <Row className="no-gutters">
                    {
                        realationProduct && realationProduct.length > 0 ?
                            <Row xs={1} md={5} className="g-4 m-auto mb-3">
                                {realationProduct.map((item) => (
                                    <ProductCard key={item.product_id} item={item} />
                                ))}
                            </Row>
                            : <h6 className='d-flex justify-content-center'>Không có sản phẩm!</h6>
                    }
                </Row>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Đánh giá</span>

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
                    {

                        <Row className='m-3'>
                            <Col className='d-flex justify-content-center'>
                                {isThumbsUp === true ?
                                    <FaThumbsUp onClick={handleIsValuate} style={{ color: 'blue' }} />
                                    : <FiThumbsUp onClick={handleIsValuate} />
                                }

                            </Col>
                            <Col className='d-flex justify-content-center'>

                                {isThumbsUp === false ?
                                    <FaThumbsDown onClick={handleIsValuate} style={{ color: 'blue' }} />
                                    : <FiThumbsDown onClick={handleIsValuate} />
                                }
                            </Col>
                        </Row>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" type='submit' onClick={handleSubmit}>
                        Gửi
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showAcceptAuctionModal}
                onHide={handleCloseAcceptAuctionModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn xác nhận đấu giá
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAcceptAuctionModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={actionAuction} >Xác nhận</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


