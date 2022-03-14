import { Row, Col, Image, Button, Container } from 'react-bootstrap';
import { GrUpdate } from 'react-icons/gr';
import UserNavBar from '../../components/UserNavBar';
import { BsArrowBarUp } from 'react-icons/bs'
import { useSelector, useDispatch } from "react-redux";
import { upgradeAccount } from './UserSlice';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';
import { useHistory } from 'react-router';

export default function UserProfile() {
    const [profile, setProfile] = useState();
    const dispatch = useDispatch();
    const [buyer, setBuyer] = useState(true);
    const account_id = jwt_decode(localStorage.x_accessToken).account_id;
    const role_id = jwt_decode(localStorage.x_accessToken).role_id;
    const [requestUpgrade, setRequestUpgrade] = useState();
    const history = useHistory();


    function handleUpgrade() {
        dispatch(upgradeAccount());
        setRequestUpgrade(true)
    }

    function getUseInfo() {
        let data = {
        };

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get("http://localhost:3002/api/accounts/detail", config)
            .then(function (res) {
                console.log(res);
                if (res.status === 200) {
                    console.log('ok')
                    setProfile(res.data.info_account);
                    setRequestUpgrade(res.data.info_account.request_update);
                    if (role_id === 2) {
                        setBuyer(false);
                    }
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }

    function handleUpdate() {
        history.push('/user/update-profile')
    }

    useEffect(() => {
        if (localStorage.x_accessToken) {
            jwt_decode(localStorage.x_accessToken).role_id === 2 ? setBuyer(false) : setBuyer(true);
        }
        getUseInfo();
    }, [dispatch])

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <div className="card mb-3 mt-4 no-gutters m-auto p-4 col-md-7 d-flex justify-content-center" >
                        <div className="row no-gutters">
                            <Row >
                                <Col className="col-md-4 m-2">
                                    <Row>
                                        <title>Avatar</title>
                                        <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU" />
                                        {buyer && !requestUpgrade ?
                                            <Button variant="success" onClick={handleUpgrade} size="sm" className='mt-4 m-auto col-md-10'>
                                                <BsArrowBarUp />
                                                Nâng cấp seller
                                            </Button>
                                            : null}
                                        {
                                            requestUpgrade && buyer ?
                                                <Button variant="secondary" disabled size="sm" className='mt-4 m-auto col-md-10'>

                                                    Đang chờ duyệt
                                                </Button>
                                                : null}
                                    </Row>
                                </Col >
                                {profile ?
                                    <Col className="col-md-7 m-2">
                                        <div >
                                            <div className="card-body">
                                                <h5 className="card-title"> {profile.full_name}
                                                </h5>
                                                <p className="card-text">
                                                    <b>Giới tính:  </b> {profile.Gender}<br />
                                                    <b>Địa chỉ:  </b>{profile.address}<br />
                                                    <b>Email:  </b>{profile.email}
                                                    <br />
                                                    <b>Điện thoại:  </b>{profile.phone}
                                                    <br />
                                                    <b>Điểm đánh giá:  </b>{profile.evaluation_score}
                                                    <br />
                                                    <b>Loại tài khoản:  </b>{profile.role_name}
                                                    <br />
                                                </p>
                                            </div>

                                        </div>
                                        <Row className="m-auto">
                                            <Col></Col>
                                            <Col md={12}><Button variant="primary" size="sm" className='mb-3' onClick={handleUpdate}><GrUpdate /> Cập nhật</Button></Col>
                                            {/* <Col md={4}><Button variant="primary" size="sm" className='mb-3'><GrUpdate /> Đổi mật khẩu</Button> </Col> */}
                                            <Col></Col>
                                        </Row>
                                    </Col >
                                    : null}
                            </Row>
                        </div>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}