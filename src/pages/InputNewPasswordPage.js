import React, { Col, Form, Row, Button, Container } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import {NotifyHelper} from "../helper/NotifyHelper";

function InputEmailPage(props) {

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const history = useHistory();
    const dispatch = useDispatch();

    const { accountid } = useParams();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            const password = event.target.password.value;
            updatePassword(password);
        }
        setValidated(true);

    };

    //call api ------------------------------------------------------------------------------------------

    function updatePassword(password){
        let data = {
            account_id: Number(accountid),
            pass_word: password
        }

        axios
        .patch("http://localhost:3002/api/accounts/reset_password", data)
        .then(function (res) {
            if (res.status === 200) {
                NotifyHelper.success(res.message, "Thông báo");
                history.push('/login')
            }
        })
        .catch(function (error) {
            NotifyHelper.error(error.message, "Thông báo");
        });
    }

    //function handle ----------------------------------------------------------------------------------->
    function handlePassword(e) {
        const pws = e.target.value;
        if (pws.length === 0) {
            setErrors({ password: 'Mật khẩu không được trống!' });
        } else {
            setErrors({ password: '' });
            if (pws.length < 6) {
                setErrors({ password: 'Mật khẩu không được ít hơn 6 ký tự' });
            } else {
                if (pws.length > 20) {
                    setErrors({ password: 'Mật khẩu không được dài hơn 20 ký tự' });
                }
            }
        }
    }

    useEffect(() => {

    }, [dispatch])

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <div className='container col-md-5'>
                        <div className='card  mt-5 p-4'  >
                            <h3 className='d-flex justify-content-center'>Nhập mật khẩu mới</h3>
                            <Form className='p-2' noValidate validated={validated} onSubmit={handleSubmit} method="post" >
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm"></Form.Label>
                                        <Form.Control
                                            required
                                            placeholder="Mật khẩu mới"
                                            defaultValue=""
                                            type="password"
                                            name="password"
                                            onChange={handlePassword}
                                            minLength={6}
                                        />
                                        <span style={{ color: "red" }}>{errors.password}</span>
                                    </Form.Group>
                                </Row >
                                <Row className='mb-2 h-1 mt-2' >
                                    <Form.Group >
                                        <Button type="submit" className='col-md-12'>Tiếp tục</Button>
                                    </Form.Group>

                                </Row>
                                <Row >
                                    <Col>
                                        <Link to='/' style={{ fontSize: '0.72rem', textDecoration: 'underline' }}>Quay về trang chủ</Link>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );

}

export default withRouter(InputEmailPage);