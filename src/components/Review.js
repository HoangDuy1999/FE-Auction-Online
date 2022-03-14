
import { Image, Row, Col } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useState } from 'react';
import ReactHtmlParser from "react-html-parser";
import { formatDateTime } from '../utils/utils';
import { Link } from 'react-router-dom';


const styles = {
    text: {
        fontSize: '0.7rem'
    },
    space: {
        width: 10,
    },
    link: {
        textDecoration: 'none',
    },

    linkNavActive: {
        textDecoration: 'none',
        color: 'white'
    },
    linkNav: {
        textDecoration: 'none',
        color: 'grey'
    },
    logoText: {
        textDecoration: 'none',
        color: 'white'
    }
}

export default function Reivew({ item }) {
    const [like, setlike] = useState(item.score === 1);
    const [modalShow, setModalShow] = useState(false);

    const data = {
        ...item,
        created_at: formatDateTime(item.created_at),
    }

    function handleLike(e) {
        setlike(!like);
    }

    //console.log(item)
    return (
        <div>
            {data ?
                <div className="card mb-3 mt-4 no-gutters" >
                    <div className="row no-gutters">
                        <Row style={styles.text}>
                            <Col className="col-md-2 m-auto">
                                <Row>
                                    <title>Placeholder</title>
                                    <Image src={data.image} style={{
                                        objectFit: 'cover',
                                        width: '6.6rem',
                                        height: '6.6rem',
                                    }} className='m-3' />
                                </Row>
                            </Col >
                            <Col className="col-md-3 m-2">
                                <h6 > {data.product_name}
                                </h6>
                                <p className="card-text">
                                    Mã sản phẩm: {data.product_id}
                                    <br />
                                    Người đánh giá: {data.name_account}
                                    <br />
                                    Đánh giá:&nbsp;
                                    {like ?
                                        <FaThumbsUp className='mb-1' style={{ color: 'blue' }} />
                                        : <FaThumbsDown className='mb-1' style={{ color: 'blue' }} />}
                                    <br />
                                    Thời gian: {data.created_at}
                                    <br />
                                    <Link to={`/product/detail?productid=${data.product_id}`} style={{ fontSize: '0.6rem' }}>Xem chi tiết</Link>
                                </p>

                            </Col >
                            <Col className="col-md-6 m-2" >
                                <b >Đánh giá:</b> <br />
                                {ReactHtmlParser(data.description)}
                            </Col>
                        </Row>
                    </div>
                </div>
                : null}
        </div>
    );
}
