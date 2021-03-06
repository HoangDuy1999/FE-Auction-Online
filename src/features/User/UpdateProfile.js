import React from 'react';
import { Col, Row, Form, Button, InputGroup, Container } from 'react-bootstrap';
import UserNavBar from '../../components/UserNavBar';
import { useEffect, useState, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { FaSave } from 'react-icons/fa';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';

export default function UpdateProfile() {
    const [validatedFullName, setValidatedFullName] = useState(false);
    const [validatedEmail, setValidatedEmail] = useState(false);
    const [validatedPassword, setValidatedPassword] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    //function of component------------------------------------------------------------------------------------------------>
    function handleSubmit() {

    }


    function handleUpdateFullName(e){
        e.preventDefault();
        e.stopPropagation();
        
        const form = e.currentTarget;
        if (form.checkValidity()) {
            let data = {
               "full_name" : "asd"
            };
            const url = "http://localhost:3002/api/accounts/fullname";
            Update(data,url);
        }
        setValidatedFullName(true);
    }


    function handleUpdateEmail(e){
        e.preventDefault();
        e.stopPropagation();
        
        const form = e.currentTarget;
        if (form.checkValidity()) {
            //console.log(e.target.email.value);
            let data = {
                "email": e.target.email.value,
                "full_name": e.target.fullName.value
            };

            const url = "http://localhost:3002/api/accounts/email";
            Update(data,url);

            const url2 = "http://localhost:3002/api/accounts/fullname";
            Update(data,url2);
        }
        setValidatedEmail(true);
    }


    function handleChangePassword(e){
        e.preventDefault();
        e.stopPropagation();
        

        const form = e.currentTarget;
        if (form.checkValidity()) {
            
            console.log(e.target.password.value);
            let data = {
                "pass_word": e.target.password.value,
                "new_pass_word": e.target.newpassword.value
            };

            const url = "http://localhost:3002/api/accounts/password";
            Update(data,url);
            
           
        }
        setValidatedPassword(true);
    }


    //function call api ------------------------------------------------------------------------------------------------>
    function Update(data, url){
        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .patch(url, data, config)
            .then(function (res) {
                console.log(res.data.watch_list);
                if (res.status === 200) {
                    NotifyHelper.success(res.data.message, "Th??ng b??o");
                }

            })
            .catch(function (error) {
                NotifyHelper.error("???? c?? l???i x???y ra", "Th??ng b??o");
            });
    }

    

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <h5 className="d-flex justify-content-center mt-4">C???p nh???t t??i kho???n!</h5>
                    <Row className='no-gutters'>
                        <Col className="card mb-3 m-4 p-4 no-gutters" md={5}>
                            <h6 className="d-flex justify-content-center mt-4">C???p nh???t th??ng tin c?? nh??n!</h6>
                            <Form noValidate validated={validatedEmail} onSubmit={handleUpdateEmail} method="post" >
                                <Row className="mb-3">
                                    <Form.Group controlId="validationFormik01">
                                        <Form.Label>T??n ng?????i d??ng</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            name="fullName"
                                            //onChange={handleChange}
                                            maxLength='255'
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>

                                </Row>
                                <Row className="mb-3">
                                    <Form.Group controlId="validationFormik01">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            required
                                            type="email"
                                            name="email"
                                            //onChange={handleChange}
                                            maxLength='100'
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>

                                </Row>
                                <Button type="submit" size="sm">C???p nh???t</Button>
                            </Form>
                        </Col>
                        <Col></Col>
                        <Col className="card mb-3 m-4 p-4 no-gutters" md={5}>
                            <h6 className="d-flex justify-content-center mt-4">?????i m???t kh???u!</h6>
                            <Form noValidate onSubmit={handleChangePassword} validated={validatedPassword} method="post" >
                                <Row className="mb-3">
                                    <Form.Group controlId="validationFormik01">
                                        <Form.Label>Nh???p m???t kh???u c??</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            name="password"
                                            //onChange={handleChange}
                                            maxLength='50'
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group controlId="validationFormik01">
                                        <Form.Label>Nh???p m???t kh???u m???i</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            name="newpassword"
                                            //onChange={handleChange}
                                            maxLength='50'
                                        />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>

                                </Row>
                                <Button  className="d-flex justify-content-center mt-4" type="submit" size="sm" >C???p nh???t</Button>
                            </Form>
                        </Col>
                    </Row>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}
