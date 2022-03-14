import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuctionningCard from './AuctionningCard';
import { useState, useEffect } from 'react';
import { NotifyHelper } from '../helper/NotifyHelper';
import axios from 'axios';

const styles = {
    card: {
        //backgroundColor: '#B7E0F2',
        borderRadius: 5,
        width: '8.8rem'
    },
    cardImage: {
        objectFit: 'cover',
        borderRadius: 55,
        with: '8.8rem',
    },
    cardTitle: {
        fontSize: '0.8rem'
    },
    cardBody: {
        width: '8.8rem'
    },
    cardText: {
        fontSize: '0.6rem'
    },
    link: {
        textDecoration: 'none',
    },

    linkNavActive: {
        textDecoration: 'none',
        color: 'white'
    },
    linkNav: {
        textDecoration: 'none',
        color: 'grey'
    },
    logoText: {
        textDecoration: 'none',
        color: 'white'
    },
    space: {
        width: 10,
    }
}



export default function AutionProducts() {
    const [auctionningProducts, setAuctionningProducts] = useState();

    function getAuctionning() {
        let data = {
        };

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get("http://localhost:3002/api/bidder/product/auction_progress", config)
            .then(function (res) {

                if (res.status === 200) {
                    setAuctionningProducts(res.data);
                    console.log(res.data)
                }

            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }

    useEffect(() => {
        getAuctionning();
    }, []);
    console.log(auctionningProducts)
    return (
        <>
            <div className="card mb-3 mt-4 no-gutters" >
                <Row xs={1} className=" ">
                    {auctionningProducts && auctionningProducts.length > 0
                        ?
                        < Row xs={1} md={5} className="g-4 m-auto mb-3" >
                            {auctionningProducts.map((item) => (
                                <AuctionningCard key={item.auction_id} item={item} />
                            ))}
                        </Row>
                        : <h6 className='d-flex justify-content-center'>Không có sản phẩm!</h6>
                    }
                </Row>
            </div>
        </>
    )
}