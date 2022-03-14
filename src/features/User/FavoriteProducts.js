import { Card, Row, Col, Container } from 'react-bootstrap';
import UserNavBar from '../../components/UserNavBar';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import WatchListCard from '../../components/WatchListCard'
import { withRouter, useHistory } from 'react-router';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';


const FavoriteProducts = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [watchList, setWatchList] = useState();


    function getWatchList() {
        let data = {
        };

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get("http://localhost:3002/api/bidder/watch_list", config)
            .then(function (res) {
                console.log(res.data.watch_list);
                if (res.status === 200) {
                    setWatchList(res.data.watch_list);
                    console.log(res.data.watch_list);
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }

    useEffect(() => {
        if (localStorage.x_accessToken) {

            getWatchList();
        }
    }, [dispatch])

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <h5 className="d-flex justify-content-center mt-4">Sản phẩm yêu thích của bạn!</h5>
                    <div className="card mb-3 mt-4 no-gutters" >
                        <div className="row no-gutters">
                            {watchList && watchList.length > 0 ?
                                <Row xs={1} md={5} className="g-4 m-auto mb-3" >
                                    {watchList.map((item) => (
                                        <WatchListCard key={item.product_id} item={item}>
                                        </WatchListCard>
                                    ))}

                                </Row>
                                : <h6 className='d-flex justify-content-center'>Không có sản phẩm!</h6>}
                        </div>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container >
    )
}

export default withRouter(FavoriteProducts);