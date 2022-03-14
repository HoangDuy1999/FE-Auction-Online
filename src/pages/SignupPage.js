import React, { Button, Col, Form, Row,Container } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { NotifyHelper } from "../helper/NotifyHelper";
import ReCAPTCHA from "react-google-recaptcha"
import { selectOTP, setOTP, setRegisterInfo } from '../features/User/UserSlice';

export default function SignupPage() {
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const [recapcha, setRecapcaha] = useState(false);
    const dispatch = useDispatch();
    let captcha;

    const userOTP = useSelector(selectOTP);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() && recapcha) {

            if (event.target.password.value === event.target.repassword.value) {
                const email = event.target.email.value;
                const pwd = event.target.password.value;
                const address = event.target.address.value;
                const full_name = event.target.fullname.value;

                getUsers({ email, pwd, address, full_name });
            }
            else {
                NotifyHelper.error("Mật khẩu nhập lại không trùng khớp", "Thông báo");
            }

        }
        setValidated(true);
        resetCaptcha();
        setRecapcaha(false);
    };


    function getUsers(data) {
        // With error handling

        if (data) {
            const body = {
                email: data.email,
                pass_word: data.pwd,
                address: data.address,
                full_name: data.full_name
            };

            axios
                .post("http://localhost:3002/api/accounts/sendOtpSignUp", body)
                .then(function (res) {
                    if (res.status === 200) {
                        //NotifyHelper.success(res.data.message, "Thông báo");
                        dispatch(setOTP(res.data.otp));
                        dispatch(setRegisterInfo(body));

                        history.push('/signup/otp');
                    }
                })
                .catch(function (error) {
                    NotifyHelper.error("Đăng ký thất bại! Tài khoản đã có người sử dụng", "Thông báo");
                });
        }
    }
    function onChange(value) {
        setRecapcaha(true);

    }
    const resetCaptcha = () => {
        // maybe set it till after is submitted
        captcha.reset();
    }
    const setCaptchaRef = (ref) => {
        if (ref) {
            return captcha = ref;
        }
    };

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
    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <div className='container col-md-5'>
                        <div className='card  mt-5 p-4'  >
                            <h3 className='d-flex justify-content-center'>Đăng ký</h3>
                            <Form noValidate validated={validated} onSubmit={handleSubmit} >
                                <Row className="">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Họ và tên</Form.Label>
                                        <Form.Control size="sm"
                                            required
                                            type="text"
                                            placeholder="Họ và tên"
                                            defaultValue=""
                                            name="fullname"
                                        />
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Địa chỉ</Form.Label>
                                        <Form.Control size="sm"
                                            required
                                            type="text"
                                            placeholder="Địa chỉ"
                                            defaultValue=""
                                            name="address"
                                           
                                        />
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Email</Form.Label>
                                        <Form.Control size="sm"
                                            required
                                            placeholder="Email"
                                            defaultValue=""
                                            type="email"
                                            name="email"
                                        />
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Mật khẩu</Form.Label>
                                        <Form.Control size="sm"
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
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="validationCustom01">
                                        <Form.Label column="sm">Lập lại mật khẩu</Form.Label>
                                        <Form.Control size="sm"
                                            required
                                            placeholder="Lập lại mật khẩu"
                                            defaultValue=""
                                            type="password"
                                            name="repassword"
                                        />
                                        <Form.Control.Feedback>Tốt!</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <ReCAPTCHA style={{ transform: 'scale(0.8)', transformOrigin: '0 0' }}
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={onChange}
                                    ref={(r) => setCaptchaRef(r)}
                                />
                                <Row className='mb-3 mt-3' >
                                    <Form.Group >
                                        <Button type="submit" className='col-md-12'>Đăng ký</Button>
                                    </Form.Group>

                                </Row>
                                <Row >
                                    <Form.Group >
                                        <Link to='/login'> <Button type="submit" className='col-md-12'>Quay về đăng nhập</Button></Link>
                                    </Form.Group>
                                </Row>
                                <Link to='/' style={{ fontSize: '0.72rem', textDecoration: 'underline' }}>Quay về trang chủ</Link>
                            </Form>
                        </div>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>


    );
}