import { Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link, Redirect } from 'react-router-dom';
import ReactHtmlParser from "react-html-parser";
import {
    formatDateTime,
    formatProductName,
    formatPrice,
    formatEndDay,
} from '../utils/utils';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

const styles = {

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

export default function AuctionHistoryCard({ item }) {
    const defaultImg = '../../public/images.png/100px250';
    //const [like, setlike] = useState();
    const dispatch = useDispatch();
    const history = useHistory();

    const id = item.product_id;
    const data = {
        ...item,
        name: formatProductName(item.name),
        current_cost: item.current_cost ? formatPrice(item.current_cost) : formatPrice(item.start_cost),
        buy_now: formatPrice(item.buy_now),
        start_day: formatDateTime(item.start_day),
        end_day: formatEndDay(item.end_day),
        image: item.image ? item.image : defaultImg
    };

    // function handleLike() {
    //     if (like) {
    //         setlike(false);
    //         dispatch(removeWatchList(id));
    //     }
    //     else {
    //         dispatch(addWatchList(id));
    //         setlike(true);
    //     }
    // }


    return (
        <Col>{data ?
            <div>
                <Card style={styles.card}>
                    <Card.Img variant="top" src={data.image} style={styles.cardImage} />
                    <Card.Body style={styles.cardBody}>
                        <Card.Title style={styles.cardTitle} className='mt-1'> {data.name} &nbsp;&nbsp;&nbsp;&nbsp;
                        </Card.Title>
                        <Card.Text style={styles.cardText} >
                            Giá: {data.current_cost}
                            <br />
                            Ngày đăng: <br />{data.start_day}
                            <br />
                            {/* <a role='text' style={{ textDecoration: 'none' }} className="text-danger">Hạn: {data.end_day}</a> */}
                            {ReactHtmlParser(data.end_day)}
                            <br />
                            Lượt đấu giá: {data.count_auction}
                            <br />
                            <Row>
                                {
                                    new Date().getTime() - new Date(item.start_day).getTime() > 0 ?
                                        <Col className='pl-2'>
                                            <Link to={`/product/detail?productid=${data.product_id}`} style={{ fontSize: '0.6rem' }}>
                                                Xem chi tiết
                                            </Link>
                                        </Col>
                                        : <Col className='pl-2'>
                                        </Col>
                                }
                                <Col className='p-0'>   <Link to={`/user/update-post-product?productid=${data.product_id}`} style={{ fontSize: '0.6rem' }}>Cập nhật</Link> </Col>
                            </Row>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            : null}
        </Col>

    )
}
