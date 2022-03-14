import { useEffect, useState } from 'react';
import { Pagination, Row, Form, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import {
    selectCategoryName,
} from '../features/product/productSlice';
import { formatDateTime, formatProductName, sortProductAscendingByPrice, sortProductDescendingByStartDate } from '../utils/utils';
import ProductCard from './ProductCard';
import { useDispatch, useSelector } from "react-redux";
import { selectWatchList, getWatchList } from '../features/User/UserSlice';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { NotifyHelper } from '../helper/NotifyHelper';

export default function Category(props) {
    const [products, setProducts] = useState();
    const [selectedSort, setSelectedSort] = useState();
    const category = useSelector(selectCategoryName);
    const { id } = useParams();
    const dispatch = useDispatch();
    const watchList = useSelector(selectWatchList);
    const location = useLocation();

    //pagiantion
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurentPage] = useState(1);
    const [isNextPage, setIsNextPage] = useState();
    const [isPreviousPage, setIsPreviousPage] = useState();
    const productPerPage = 5;

    //data to show
    const [data, setData] = useState([]);

    useEffect(() => {

        getProductsByCategory(id);
        if (localStorage.x_accessToken) {
            dispatch(getWatchList());
        }
    }, [dispatch,location]);


    useEffect(() => {
        if (products) {
            setData(products
                .filter((_, index) => (index <= currentPage * productPerPage - 1 && index >= (currentPage - 1) * productPerPage)));
            
            pagination();
        }
        console.log(data)
    }, [currentPage,selectedSort]);

    

    function handlePreviousPage() {
        if (currentPage !== 1) {
            setCurentPage(currentPage - 1);
        }
    }

    function handleNextPage() {
        if (currentPage !== totalPage) {
            setCurentPage(currentPage + 1);
        }
    }

    function pagination() {


        if (currentPage === 1) {
            setIsPreviousPage(false);
            setIsNextPage(true);
        } else {
            setIsPreviousPage(true);
        }

        if (currentPage === totalPage) {
            setIsNextPage(false);
            setIsPreviousPage(true);
        } else {
            setIsNextPage(true);
        }
    }

    function handleSort(event) {
        console.log(event.target.value);
        const selected = event.target.value;


        if (selected === 'ascending') {

            setProducts(sortProductAscendingByPrice(products));

        }
        else if (selected === 'newest') {
            setProducts(sortProductDescendingByStartDate(products));

        }
        console.log(products)
        setSelectedSort(selected);
        setCurentPage(1);
    }

    function getProductsByCategory() {
        let data = {
        };

        const config = {
            headers: {
                'x-access-token': localStorage.x_accessToken,
                'x-refresh-token': localStorage.x_refreshToken
            }
        }

        axios
            .get(`http://localhost:3002/api/products/category/${id}`, config)
            .then(function (res) {
                if (res.status === 200) {
                    //console.log(res.data.info_types)
                    setProducts(res.data.info_types);
                    setData(res.data.info_types.filter((_, index) => (index <= currentPage * productPerPage - 1 && index >= (currentPage - 1) * productPerPage)));

                    const t = Math.ceil(res.data.info_types.length / productPerPage);
                    setTotalPage(t);
                    setCurentPage(1);
                    pagination();

                }
            })
            .catch(function (error) {
                NotifyHelper.error("Đã có lỗi xảy ra", "Thông báo");
            });
    }

    console.log(products)
    return (
        <div className="container mt-4" fluid>
            <Row>
                <Col md={6}>
                    <h5 className='mb-4'>Danh mục: {data ? category : null}</h5>
                </Col>
                <Col></Col>
                <Col md={3}>
                    <Form.Select size="sm" onChange={handleSort}>
                        <option value="newest">Mới nhất</option>
                        <option value="ascending">Giá tăng dần</option>
                    </Form.Select>
                </Col>

            </Row>

            <Row xs={1} md={5} className="g-4 "  >
                {data ? data.map((item) => (
                    <ProductCard key={item.auction_id} item={item} watchList={watchList} />
                ))
                    : <h6>Không có dữ liệu!</h6>}
            </Row>
            <div style={{ height: '2rem' }}></div>
            <Pagination className='d-flex justify-content-center'>
                <Pagination.Prev disabled={!isPreviousPage} onClick={handlePreviousPage} />
                {Array.from({ length: totalPage }).map((_, index) => (
                    <Pagination.Item active={index + 1 === currentPage} onClick={() => setCurentPage(index + 1)}>{index + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next disabled={!isNextPage} onClick={handleNextPage} />

            </Pagination>

        </div>
    )
}