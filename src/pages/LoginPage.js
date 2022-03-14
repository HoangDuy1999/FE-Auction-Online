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
                                        NotifyHelper.success("Đăng nhập thành công", "Thông báo");
                                        history.push("/");

                                        break;
                                    case 3:
                                        dispatch(setUser());
                                        history.push("/admin");
                                        NotifyHelper.success("Đăng nhập thành công", "Thông báo");
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
                    NotifyHelper.error("Đăng nhập thất bại", "Thông báo");
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
                                        NotifyHelper.success("Đăng nhập thành công", "Thông báo");
                                        history.push("/");

                                        break;
                                    case 3:
                                        dispatch(setUser());
                                        history.push("/admin");
                                        NotifyHelper.success("Đăng nhập thành công", "Thông báo");
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
                    NotifyHelper.error("Đăng nhập thất bại", "Thông báo");
                });
        }
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
                            <h3 className='d-flex justify-content-center'>Đăng nhập</h3>
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
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-4">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Mật khẩu</Form.Label>
                                        <Form.Control
                                            required
                                            placeholder="Mật khẩu"
                                            defaultValue=""
                                            type="password"
                                            name="password"
                                            onChange={handlePassword}
                                        />
                                        <span style={{ color: "red" }}>{errors.password}</span>
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row >

                                <Row className='mb-2 h-1' >
                                    <Form.Group >
                                        <Button type="submit" className='col-md-12'>Đăng nhập</Button>
                                    </Form.Group>

                                </Row>
                                <Row >
                                    <Form.Group >
                                        <Link to='/signup'> <Button type="submit" className='col-md-12'>Đăng ký</Button></Link>
                                    </Form.Group>
                                </Row>
                                <Row >
                                    <Col>
                                        <Link to='/' style={{ fontSize: '0.72rem', textDecoration: 'underline' }}>Quay về trang chủ</Link>
                                    </Col>
                                    <Col>
                                        <Link to='/input-email' style={{ fontSize: '0.72rem', textDecoration: 'underline' }}>Quên mật khẩu?</Link>
                                    </Col>
                                </Row>
                            </Form>
                            <hr />
                            <h6 className='d-flex justify-content-center'>Đăng nhập với google</h6>
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