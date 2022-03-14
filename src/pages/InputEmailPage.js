import React, { Col, Form, Row, Button, Container } from "react-bootstrap";
import { useState, useEffect } from 'react';
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import axios from "axios";
import { NotifyHelper } from "../helper/NotifyHelper";

function InputEmailPage(props) {

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const history = useHistory();
    const dispatch = useDispatch();



    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            const email = event.target.email.value;
            checkEmailExist(email);
        }
        setValidated(true);

    };

    //call api
    function checkEmailExist(email){
        const data = {
            email: email
        }

        axios
        .get("http://localhost:3002/api/accounts/check_email", data)
        .then(function (res) {
            if (res.status === 200) {
                NotifyHelper.success(res.message, "Thông báo");
                history.push(`/otp-reset-password/${email}`)
            }
        })
        .catch(function (error) {
            NotifyHelper.error(error.message, "Thông báo");
        });
    }

    //function handle ----------------------------------------------------------------------------------->
    
    function handleEmail(e) {
        const mail = e.target.value;
        if (mail.length === 0 || mail === "") {
            //formIsValid = false;
            setErrors({ email: 'Email không được trống!' });
        }
        else {
            setErrors({ email: '' });
            if (typeof mail !== "undefined") {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(mail).toLowerCase())) {
                    setErrors({ email: 'Email không hợp lệ!' });
                } else {
                    setErrors({ email: '' });
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
                            <h3 className='d-flex justify-content-center'>Lấy lại mật khẩu</h3>
                            <Form className='p-2' noValidate validated={validated} onSubmit={handleSubmit} method="post" >
                                <Row className="">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Nhập email cần khôi phục:</Form.Label>
                                        <Form.Control size="sm"
                                            required
                                            type="email"
                                            placeholder="Email"
                                            defaultValue=""
                                            name="email"
                                            onChange={handleEmail}
                                        />
                                        <span style={{ color: "red" }}>{errors.email}</span>
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
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