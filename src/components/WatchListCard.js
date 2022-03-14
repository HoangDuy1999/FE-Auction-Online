import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import { AiOutlineHeart,AiFillHeart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import {
    formatDateTime,
    formatProductName,
    formatPrice,
    formatEndDay,
} from '../utils/utils';
import { useEffect } from 'react';
import { addWatchList, removeWatchList } from '../features/User/UserSlice';
import {  useDispatch } from "react-redux";
import ReactHtmlParser from "react-html-parser";


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

export default function WatchListCard({ item, watchList }) {
    const defaultImg = '../../public/images.png/100px250';
    const [like, setlike] = useState(true);
    const id = item.product_id;
    const dispatch = useDispatch();

    const data = {
        ...item,
        product_name: formatProductName(item.product_name),
        start_cost: formatPrice(item.start_cost),
        start_day: formatDateTime(item.start_day),
        end_day: formatEndDay(item.end_day),
        image: item.image ? item.image : defaultImg
    };

    function handleLike() {
        if(like){
            dispatch(removeWatchList(id));
            setlike(false);
        }
        else{
            dispatch(addWatchList(id));
            setlike(true);
        }
    }


    useEffect(() => {

        if (watchList) {
            if (watchList.some(item => id === item.product_id))
                setlike(true);
        }
    });

    return (
        <Col>{data ?
            <div>
                <Card style={styles.card} >
                    <Card.Img variant="top" style={styles.cardImage} src={data.product_image} />
                    <Card.Body style={styles.cardBody}>
                        <Card.Title style={styles.cardTitle}> {data.product_name}</Card.Title>
                        <Card.Text style={styles.cardText} >
                            Mã SP: {data.product_id}
                            <br />
                            Khời điểm: {data.start_cost}
                            <br />
                            Người bán: {data.seller_name}
                            <br />
                            Danh mục: {data.category_name}
                            <br />
                            Ngày bắt đầu: {data.start_day}
                            <br />
                            {/* <a role='text' style={{ textDecoration: 'none' }} className="text-danger">Hạn: {data.end_day}</a> */}
                            {ReactHtmlParser(data.end_day)}
                            <br />
                            <Link to={`/product/detail?productid=${data.product_id}`} style={{ fontSize: '0.6rem' }}>Xem chi tiết</Link>
                        </Card.Text>
                        <Row className="d-flex justify-content-center">
                            <p role='button' className='d-flex justify-content-center' onClick={handleLike}>
                                {like ? <AiFillHeart style={{ color: 'red' }} /> : <AiOutlineHeart />}
                            </p>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
            : null}
        </Col>

    )
}