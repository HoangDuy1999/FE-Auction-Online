import OtpInput from "react-otp-input";
import {
    useState,
    useEffect
} from "react";
import { Row,Container,Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectOTP, setOTP, selectRegisterInfo } from '../features/User/UserSlice';
import { useHistory } from "react-router";
import { NotifyHelper } from "../helper/NotifyHelper";
import { Link } from "react-router-dom";
import axios from "axios";

export default function OtpPage() {
    const userOTP = useSelector(selectOTP);
    const registerInfo = useSelector(selectRegisterInfo);
    const history = useHistory();
    const [otp, setOtp] = useState('');
    const [timeout, setTimeOut] = useState(60);
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setOtp(e);

        if (e.length === 6) {
            if (userOTP == e && !errors.otpOver) {
                axios
                    .post("http://localhost:3002/api/accounts", registerInfo)
                    .then(function (res) {
                        if (res.status === 200) {
                            NotifyHelper.success('Đăng ký tài khoản thành công! Chuyển sang trang đăng nhập sau 5 giây', 'Thông báo')
                            setTimeout(() => {
                                history.push('/login');
                            }, 5000);
                        }
                    })
                    .catch(function (error) {
                        NotifyHelper.error("Đăng ký thất bại! Tài khoản đã có người sử dụng", "Thông báo");
                    });

            }
        }
    }



    useEffect(() => {
        let myInterval = setInterval(() => {

            if (timeout > 0) {
                setTimeOut(timeout - 1);

            }
            else {
                setErrors({ otpOver: 'Đã hết thời gian nhập OTP' })
                return
            }


        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    })


    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <div className='container col-md-5'>
                        <div className='card  mt-5 p-4' >
                            <h3 className='d-flex justify-content-center'>Nhập mã OTP</h3>
                            <span className='d-flex justify-content-center'>OTP hết hạn trong:{timeout} giây </span>
                            <span className='d-flex justify-content-center mb-2' style={{ color: "red" }}>{errors.otpOver}</span>
                            <Row className='m-auto'>
                                <OtpInput
                                    value={otp}
                                    onChange={handleChange}
                                    numInputs={6}
                                    separator={<span className='w-4'>-</span>}
                                />
                            </Row>
                            <Link to='/signup'>
                                <span className='d-flex justify-content-center mt-2' style={{ color: "green", textDecoration: 'underline' }}>
                                    Quay lại đăng ký
                                </span>
                            </Link>
                        </div>
                    </div>

                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}
