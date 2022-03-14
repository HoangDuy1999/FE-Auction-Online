import { useEffect, useState } from 'react';
import { Col, Row, Nav, Navbar, Image, Badge } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link, Redirect } from 'react-router-dom';
import ReactHtmlParser from "react-html-parser";
import { selectWatchList, addWatchList, getWatchList, removeWatchList } from '../features/User/UserSlice';
import {
    formatDateTime,
    formatProductName,
    formatPrice,
    formatEndDay,
} from '../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { NotifyHelper } from '../helper/NotifyHelper';
import { timeLimit } from '../helper/timeLimitHelper';
import axiosClient from '../api/axiosClient';


const styles = {
    container: {
        position: 'relative',
        textAlign: 'center',

    },
    bottomLeft: {
        position: 'absolute',
        bottom: '8px',
        left: '16px',
    },
    whiteLable: {
        position: 'absolute',
        top: ' 0.8rem',
        left: '0.8rem',
        color: 'white',
    },
    blackLable: {
        color: 'red',
        position: 'absolute',
        top: '0.8rem',
        left: '0.8rem',
    },
    card: {
        //backgroundColor: '#B7E0F2',
        borderRadius: 5,
        width: '8.8rem'
    },
    cardImage: {
        objectFit: 'cover',
        width: '8.6rem',
        height: '8.6rem',
    },
    cardTitle: {
        fontSize: '0.8rem'
    },
    cardBody: {
        width: '8.8rem'
    },
    cardText: {
        fontSize: '0.6rem'
    },
}

export default function ProductCard({ item }) {
    const defaultImg = '../../public/images.png/100px250';
    const [like, setlike] = useState();
    const dispatch = useDispatch();
    const [validUser, setValidUser] = useState(false);
    const [watchList, setWatchList] = useState();
    const history = useHistory();
    const [flicker, setFlicker] = useState(false);
    const [isNewProduct, setIsNewProduct] = useState(false);

    const id = item.product_id;
    const data = {
        ...item,
        name: formatProductName(item.name),
        start_cost: formatPrice(item.start_cost),
        buy_now: formatPrice(item.buy_now),
        created_at: formatDateTime(item.created_at),
        start_day: formatDateTime(item.start_day),
        end_day: formatEndDay(item.end_day),
        image: item.image ? item.image : defaultImg
    };

    function handleLike() {
        if (like) {
            setlike(false);
            dispatch(removeWatchList(id));
        }
        else {
            dispatch(addWatchList(id));
            setlike(true);
        }
    }

    function getWatchList() {
        let data = {
        };

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }
       
        axiosClient
            .get("/bidder/watch_list")
            .then(function (res) {
                if (res.status === 200) {
                    setWatchList(res.data.watch_list);
                    if (res.data.watch_list.some(item => id === item.product_id))
                        setlike(true);
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }



    useEffect(() => {
        if (item) {
            if (new Date().getTime() - (new Date(item.start_day)) < timeLimit.NewProduct) {
               
                setIsNewProduct(true);
            }
        }
        if (localStorage.x_accessToken) {
            getWatchList();
            setValidUser(true);
        }
    }, [dispatch])


    return (
        <Col>{data ?
            <div>
                <Card style={styles.card}>
                    <div style={styles.container}>
                        <Card.Img variant="top" src={data.image} style={styles.cardImage} />
                        {isNewProduct ?
                            <Badge pill bg="warning" text="dark" style={styles.bottomLeft, flicker ? styles.whiteLable : styles.blackLable}>
                                Mới
                            </Badge>
                            : null}
                    </div>
                    <Card.Body style={styles.cardBody}>
                        <Card.Title style={styles.cardTitle} className='mt-1'> {data.name} &nbsp;&nbsp;&nbsp;&nbsp;
                        </Card.Title>
                        <Card.Text style={styles.cardText} >
                            Đấu giá: {data.start_cost}
                            <br />
                            Seller:  {data.seller_name.length > 13 ? data.seller_name :
                                <>
                                    {data.seller_name}
                                    {ReactHtmlParser('&nbsp;')}
                                </>
                            }
                            <br />
                            Mua Ngay: {data.buy_now}
                            <br />
                            Bắt đầu: <br />{data.start_day}
                            <br />
                            {/* <a role='text' style={{ textDecoration: 'none' }} className="text-danger">Hạn: {data.end_day}</a> */}
                            {ReactHtmlParser(data.end_day)}
                            <br />
                            Lượt đấu giá: {data.count_auction}
                            <br />
                            <Link to={`/product/detail?productid=${data.product_id}`} style={{ fontSize: '0.6rem' }}>Xem chi tiết</Link>



                        </Card.Text>
                        <Row >
                            {
                                validUser ?
                                    <p role='button' className='d-flex justify-content-center' onClick={handleLike}>
                                        {like ? <AiFillHeart style={{ color: 'red' }} /> : <AiOutlineHeart />}
                                    </p>
                                    : null
                            }

                        </Row>
                    </Card.Body>
                </Card>
            </div>
            : null}
        </Col>

    )
}