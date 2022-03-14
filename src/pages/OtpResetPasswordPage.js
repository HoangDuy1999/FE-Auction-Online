import OtpInput from "react-otp-input";
import {
    useState,
    useEffect
} from "react";
import { Row,Container,Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectOTP, setOTP, selectRegisterInfo } from '../features/User/UserSlice';
import { useHistory, useParams } from "react-router";
import { NotifyHelper } from "../helper/NotifyHelper";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function OtpResetPasswordPage() {
    const registerInfo = useSelector(selectRegisterInfo);
    const history = useHistory();
    const [otp, setOtp] = useState('');
    const [userOTP, setUserOTP] = useState();
    const [accountId, setAccountId] = useState();
    const [timeout, setTimeOut] = useState(60);
    const [errors, setErrors] = useState({});


    const { email } = useParams();

    // call api ---------------------------------------------------------------------------------------------------------
    function sendOtp(){
        let data = {
            email: email
        }

        axiosClient
        .post("accounts/sendOtpResetPassWord", data)
        .then(function (res) {
            if (res.status === 200) {
                console.log(res.data.otp);
                console.log(res.data.info);
                setUserOTP(res.data.otp)
                setAccountId(res.data.info.account_id)
                NotifyHelper.error(res.message, "Thông báo");
            }
        })
        .catch(function (error) {
            NotifyHelper.error(error.message, "Thông báo");
        });
    }

    function handleChange(e) {
        setOtp(e);

        if (e.length === 6) {
            if (userOTP == e && !errors.otpOver) {
                history.push(`/input-new-password/${accountId}`)
            }
        }
    }

    useEffect(() => {
        if(email)
            sendOtp();
    },[])

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
