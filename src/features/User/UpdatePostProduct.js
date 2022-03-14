
import NavigationBar from '../../components/NavigationBar';
import { Container, Col, Row, Image, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';
import { useState, useEffect } from 'react';
import { formatDateTime, formatPrice, formatEndDay } from '../../utils/utils';
import ReactHtmlParser from "react-html-parser";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ImHammer2 } from "react-icons/im";
import ReactQuill from "react-quill";
import { modules, formats } from '../../utils/quillConfig';
import Footer from '../../components/Footer';
import { useLocation } from "react-router-dom";

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

export default function UpadtePostProduct() {
    const [infoProduct, setInfoProduct] = useState();
    const [data, setData] = useState();
    const [description, setDescription] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [validated, setValidated] = useState(false);
   

    const query = new URLSearchParams(useLocation().search);
    const id = query.get("productid");

    //function call api --------------------------------------------------------------------------------------------->
    function getInfoProdduct() {
        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken ? localStorage.x_accessToken : null,
                'x-refresh-token': localStorage.x_refreshToken ?  localStorage.x_refreshToken : null
            }
        }

        axios
            .get(`http://localhost:3002/api/seller/product/info/${id}`, config)
            .then(function (res) {
                if (res.status === 200) {
                    setInfoProduct(res.data.infoProduct)
                    const temp = { ...res.data.infoProduct };
                    const _data = {
                        ...infoProduct,
                        created_at: formatDateTime(temp.created_at),
                        start_day: formatDateTime(temp.start_day),
                        buy_now: formatPrice(temp.buy_now),
                        start_cost: formatPrice(temp.start_cost),
                        end_day: formatEndDay(temp.end_day),
                    }
                    setData(_data);
                    setNewDescription(_data.description)
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }

    function updateDescription(data) {

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .patch("http://localhost:3002/api/seller/product", data, config)
            .then(function (res) {
                //console.log(res)
                if (res.status === 200) {
                    NotifyHelper.success("Cập nhật thành công", "Thông báo");
                    setDescription("");
                    const newData = {
                        ...data,
                        description: newDescription,
                    }
                    setData(newData);
                }


            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");

            });

    }

    //function handle
    function handleUpdateDescription(e) {
        e.preventDefault();
        e.stopPropagation();


        const form = e.currentTarget;
        if (form.checkValidity() && data) {
            const d = data.description ? data.description : "";
            const nd = description ? description: "";
            setNewDescription("<span> " + d +  nd + " </span> ");
            const newData = {
                product_id: data.product_id,
                description: "<span> " + d +  nd + " </span> "
            }
            updateDescription(newData)

        }
        setValidated(true);
    }

    //useEffect ----------------------------------------------------------------------------------------------->
    useEffect(() => {
        getInfoProdduct();

    }, [newDescription]);

    
    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <NavigationBar />
                    <div className="card mb-3 mt-4 no-gutters" >
                        <div className="row no-gutters">
                            {data ?
                                <Row >
                                    <Col className="col-md-4 m-2">
                                        <Row >
                                            <title>Placeholder</title>
                                            <Image src={data.image ? data.image[0] : ''} style={styles.cardImage} />
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

                                    </Col >
                                    <Col className="col-md-7 m-2">
                                        <div >
                                            <div className="card-body">
                                                <h5 className="card-title">{data.name}
                                                </h5>
                                                <p className="card-text">
                                                    Giá hiện tại: {data.start_cost} <br />

                                                    <Button className='m-2 ' variant="success"> <AiOutlineShoppingCart></AiOutlineShoppingCart>&nbsp; Mua ngay
                                                    </Button> {data.buy_now}

                                                    <br />
                                                    Người bán: {data.seller_name} &nbsp;&nbsp;&nbsp;&nbsp;  Đánh giá: {data.evaluation_score} điểm
                                                    <br />
                                                    Đăng: {data.created_at}
                                                    <br />
                                                    Bắtđầu: {data.start_day}
                                                    <br />

                                                    {ReactHtmlParser(data.end_day)}
                                                </p>

                                                <Button className='mb-2' variant="warning"> <ImHammer2 /> &nbsp;Đấu giá
                                                </Button>
                                                &nbsp;&nbsp;&nbsp;&nbsp;

                                                <br /><br />
                                                <b >Thông tin sản phẩm</b>
                                                {ReactHtmlParser(data.description)}
                                            </div>
                                        </div>
                                    </Col >
                                </Row>
                                : null
                            }

                        </div>
                    </div>

                    {/* update section */}
                    <h5 className="card-title"> Thông tin bổ sung </h5>
                    <Form noValidate onSubmit={handleUpdateDescription} validated={validated} method="get" >
                        <ReactQuill
                            onChange={setDescription}
                            value={description}
                            modules={modules}
                            formats={formats}
                            bounds={'.app'}
                            placeholder=''
                        />
                        <Row className='d-flex justify-content-center'>
                            <Button type="submit" className='mt-3 col-md-2'>Cập nhật</Button>
                        </Row>
                    </Form>
                    <Footer />
                </Col>
                <Col></Col>
            </Row>
        </Container>

    )
};