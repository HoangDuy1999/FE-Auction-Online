import React, { Col, Form, Row, Button, Container } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUser, refresh } from "../features/User/UserSlice";
import { Link } from "react-router-dom";
import { NotifyHelper } from "../helper/NotifyHelper";
import { withRouter } from 'react-router-dom';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

function Login(props) {

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const history = useHistory();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();



    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            const email = event.target.email.value;
            const pwd = event.target.password.value;
            getUsers({ email, pwd });
        }
        setValidated(true);

    };

    //function call api------------------------------------------------------------------------>
    function getUsers(data) {
        // With error handling

        if (data) {
            const body = {
                email: data.email,
                pass_word: data.pwd
            };

            axios
                .post("http://localhost:3002/api/accounts/signin", body)
                .then(function (res) {
                    if (res.status === 200)
                        if (res.data.authenticated === true) {
                            const { accessToken, refreshToken } = res.data;

                            localStorage.setItem('x_accessToken', accessToken);
                            localStorage.setItem('x_refreshToken', refreshToken);

                            const user = jwt_decode(accessToken);
                            dispatch(setUser(user));
                            if (user.role_id !== undefined) {
                                switch (user.role_id) {
                                    case 1:
                                    case 2:
                                        dispatch(setUser());
                                        NotifyHelper.success("????ng nh???p th??nh c??ng", "Th??ng b??o");
                                        history.push("/");

                                        break;
                                    case 3:
                                        dispatch(setUser());
                                        history.push("/admin");
                                        NotifyHelper.success("????ng nh???p th??nh c??ng", "Th??ng b??o");
                                        break;
                                    default:
                                        break;
                                }
                            }

                        }
                    if (res.status === 400) {
                        console.log(res.data)
                    }
                })
                .catch(function (error) {
                    NotifyHelper.error("????ng nh???p th???t b???i", "Th??ng b??o");
                });
        }
    }

    function loginGoogle(data) {
        // With error handling

        if (data) {
            const body = {
                email: data
            };

            axios
                .post("http://localhost:3002/api/accounts/login-google", body)
                .then(function (res) {
                    if (res.status === 200)
                        if (res.data.authenticated === true) {
                            const { accessToken, refreshToken } = res.data;

                            localStorage.setItem('x_accessToken', accessToken);
                            localStorage.setItem('x_refreshToken', refreshToken);

                            const user = jwt_decode(accessToken);
                            if (user.role_id !== undefined) {
                                switch (user.role_id) {
                                    case 1:
                                    case 2:
                                        dispatch(setUser());
                                        NotifyHelper.success("????ng nh???p th??nh c??ng", "Th??ng b??o");
                                        history.push("/");

                                        break;
                                    case 3:
                                        dispatch(setUser());
                                        history.push("/admin");
                                        NotifyHelper.success("????ng nh???p th??nh c??ng", "Th??ng b??o");
                                        break;
                                    default:
                                        break;
                                }
                            }

                        }
                    if (res.status === 400) {
                        console.log(res.data)
                    }
                })
                .catch(function (error) {
                    NotifyHelper.error("????ng nh???p th???t b???i", "Th??ng b??o");
                });
        }
    }

    //function handle ----------------------------------------------------------------------------------->
    function handleEmail(e) {
        const mail = e.target.value;
        if (mail.length === 0 || mail === "") {
            //formIsValid = false;
            setErrors({ email: 'Email kh??ng ???????c tr???ng!' });
        }
        else {
            setErrors({ email: '' });
            if (typeof mail !== "undefined") {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(String(mail).toLowerCase())) {
                    setErrors({ email: 'Email kh??ng h???p l???!' });
                } else {
                    setErrors({ email: '' });
                }
            }
        }
    }

    function handlePassword(e) {
        const pws = e.target.value;
        if (pws.length === 0) {
            setErrors({ password: 'M???t kh???u kh??ng ???????c tr???ng!' });
        } else {
            setErrors({ password: '' });
            if (pws.length < 6) {
                setErrors({ password: 'M???t kh???u kh??ng ???????c ??t h??n 6 k?? t???' });
            } else {
                if (pws.length > 20) {
                    setErrors({ password: 'M???t kh???u kh??ng ???????c d??i h??n 20 k?? t???' });
                }
            }
        }
    }


    const responseGoogleSuccessed = (response) => {
        console.log(response.profileObj.email)
        const data = response.profileObj.email;
        loginGoogle(data)
    }
    const responseGoogleFailed = (response) => {
        const rs = JSON.stringify(response)
        console.log(rs.email);
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
                            <h3 className='d-flex justify-content-center'>????ng nh???p</h3>
                            <Form className='p-2' noValidate validated={validated} onSubmit={handleSubmit} method="post" >
                                <Row className="">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Email</Form.Label>
                                        <Form.Control size="sm"
                                            required
                                            type="email"
                                            placeholder="Email"
                                            defaultValue=""
                                            name="email"
                                            onChange={handleEmail}
                                        />
                                        <span style={{ color: "red" }}>{errors.email}</span>
                                        <Form.Control.Feedback>T???t!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">M???t kh???u</Form.Label>
                                        <Form.Control
                                            required
                                            placeholder="M???t kh???u"
                                            defaultValue=""
                                            type="password"
                                            name="password"
                                            onChange={handlePassword}
                                        />
                                        <span style={{ color: "red" }}>{errors.password}</span>
                                        <Form.Control.Feedback>T???t!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row >

                                <Row className='mb-2 h-1' >
                                    <Form.Group >
                                        <Button type="submit" className='col-md-12'>????ng nh???p</Button>
                                    </Form.Group>

                                </Row>
                                <Row >
                                    <Form.Group >
                                        <Link to='/signup'> <Button type="submit" className='col-md-12'>????ng k??</Button></Link>
                                    </Form.Group>
                                </Row>
                                <Row >
                                    <Col>
                                        <Link to='/' style={{ fontSize: '0.72rem', textDecoration: 'underline' }}>Quay v??? trang ch???</Link>
                                    </Col>
                                    <Col>
                                        <Link to='/input-email' style={{ fontSize: '0.72rem', textDecoration: 'underline' }}>Qu??n m???t kh???u?</Link>
                                    </Col>
                                </Row>
                            </Form>
                            <hr />
                            <h6 className='d-flex justify-content-center'>????ng nh???p v???i google</h6>
                            <GoogleLogin
                                clientId="870000679676-1m2jdosvasi9l3cko23u7ss06bujcagg.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={responseGoogleSuccessed}
                                onFailure={responseGoogleFailed}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    );

}

export default withRouter(Login);