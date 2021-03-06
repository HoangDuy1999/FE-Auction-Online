import { Form, Row, Col, Button, InputGroup, Container } from 'react-bootstrap';
import UserNavBar from '../../components/UserNavBar';
import * as yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import { useEffect, useState, Component } from 'react';
import PropTypes from 'prop-types';
import storage from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getCategories, selectCategories } from '../product/categorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router";
import { formatDateTime, formatDateTimeToPost } from '../../utils/utils';
import { NotifyHelper } from '../../helper/NotifyHelper';
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TimePicker } from 'antd';
import moment from 'moment';
import { modules, formats } from '../../utils/quillConfig';
import Footer from '../../components/Footer';

const schema = yup.object().shape({
    productName: yup.string().required(),

});


const propTypes = {
    placeholder: PropTypes.string,
}

const metadata = {
    contentType: 'image/jpeg'
};

export default function PostProduct() {
    const [state, setstate] = useState({ editorHtml: '' });
    const [categorySelected, setcategorySelected] = useState(1);
    const dispatch = useDispatch();
    const history = useHistory();
    const [validated, setValidated] = useState(false);
    const [dayCountAuction, setDayCountAuction] = useState(3);

    //decription
    const [description, setDescription] = useState("");
    const [autoRenew, setAutoRenew] = useState(0);

    //upload imge
    const [mainImage, setMainImage] = useState(null);
    const [extra1Image, setExtra1Image] = useState(null);
    const [extra2Image, setExtra2Image] = useState(null);
    const [extra3Image, setExtra3Image] = useState(null);
    const [stepCost, setStepCost] = useState(100000);


    //define categories
    const categories = useSelector(selectCategories);

    //time picker
    const timePickerFormat = 'HH:mm';
    const [startDate, setStartDate] = useState((new Date()));
    const [startTime, setStartTime] = useState(moment('00:00', timePickerFormat));


    async function handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();


        const form = e.currentTarget;
        if (form.checkValidity()) {
            const currentTime = new Date();

            if (startDate.getDate() <= currentTime.getDate()) {
                NotifyHelper.error('Ng??y b???t ?????u ?????u gi?? ph???i l???n h??n ng??y hi???n t???i', 'Th??ng b??o');
                return;
            }
            const productName = e.target.productName.value;
            const category_id = categorySelected;

            const start_cost = e.target.start_cost.value;
            const step_cost = stepCost;
            const buy_now = e.target.but_now.value ? e.target.but_now.value : null;

            //caculate startday
            const start_day = new Date();
            start_day.setDate(startDate.getDate());
            start_day.setMonth(startDate.getMonth());
            start_day.setFullYear(startDate.getFullYear());
            start_day.setHours(startTime.toDate().getHours());
            start_day.setMinutes(startTime.toDate().getMinutes());
            start_day.setSeconds('00');
            console.log(start_day)
            const o_start_day = formatDateTimeToPost(start_day);
            //console.log(start_day)


            //caculate end day
            var myDate = start_day;
            myDate.setDate(myDate.getDate() + dayCountAuction);
            const end_day = formatDateTimeToPost(myDate);

            const urlImg = mainImage + ',' + extra1Image + ',' + extra2Image + ',' + extra3Image;
            //up img to firebase

            //create data to post
            const data = {
                name: productName,
                category_id: category_id,
                image: urlImg,
                start_cost: Number(start_cost),
                step_cost: Number(step_cost),
                buy_now: buy_now ? buy_now : 0,
                start_day: o_start_day,
                end_day: end_day,
                description: description,
                is_auto_renew: autoRenew,
            }

            //post data to server
            post(data);
            //console.log(data)

            //clear form
            //e.target.productName.value = "";
        }
        setValidated(true);
    }


    //post
    async function post(data) {
        let headers = {};
        headers['x-access-token'] = localStorage.x_accessToken ? localStorage.x_accessToken : null;
        headers['x-refresh-token'] = localStorage.x_refreshToken ? localStorage.x_refreshToken : null;
        let config = {
            headers: { ...headers, 'Content-Type': 'application/json' }
        }
        axios
            .post("http://localhost:3002/api/seller/product", data, config)
            .then(function (res) {
                if (res.status === 200)
                    NotifyHelper.success(res.data.message, "Th??ng b??o")
            })
            .catch(function (error) {
                NotifyHelper.error(error, "Th??ng b??o");
            });

    }

    async function upImgToFireBase(image, index) {
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        //console.log('Upload is paused');
                        break;
                    case 'running':
                        //console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    if (index === 1)
                        setMainImage(downloadURL);
                    if (index === 2)
                        setExtra1Image(downloadURL);
                    if (index === 3)
                        setExtra2Image(downloadURL);
                    if (index === 4)
                        setExtra3Image(downloadURL);
                });
            }
        );
    }

    //handle main image
    function handleMainImage(e) {
        if (e.target.files[0]) {
            upImgToFireBase(e.target.files[0], 1);
        }
    }

    function handleExtra1Image(e) {
        if (e.target.files[0]) {
            upImgToFireBase(e.target.files[0], 2);
        }
    }

    function handleExtra2Image(e) {
        if (e.target.files[0]) {
            upImgToFireBase(e.target.files[0], 3);
        }
    }

    function handleExtra3Image(e) {
        if (e.target.files[0]) {
            upImgToFireBase(e.target.files[0], 4);
        }
    }


    function handleCategory(event) {
        setcategorySelected(event.target.value);
    }

    function handleStepCost(event) {
        setStepCost(event.target.value);
    }

    function handleAutoRenew(event) {
        event.target.checked ? setAutoRenew(1) : setAutoRenew(0);
    }


    //get categories
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    //console.log(startDate)
    //console.log(startTime.toDate())
    return (
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    <UserNavBar />
                    <Container className='p-4'>
                        <h5 className="d-flex justify-content-center mt-4">????ng s???n ph???m!</h5>
                        <Form noValidate onSubmit={handleSubmit} validated={validated} method="get" >
                            <Row className="mb-3">
                                <Form.Group as={Col} md="8" controlId="validationFormik01">
                                    <Form.Label>T??n s???n ph???m</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="productName"
                                        //onChange={handleChange}
                                        maxLength='255'
                                    />
                                     <Form.Control.Feedback type="invalid">
                                        T???i ??a: 255 k?? t???
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>T???t!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="4" >
                                    <Form.Label>Danh m???c</Form.Label>
                                    <Form.Select onChange={handleCategory} value={categorySelected} defaultValue="Ch???n danh m???c s???n ph???m" >
                                        {categories.map(item => <option key={item.category_id} value={item.category_id}>{item.name} </option>

                                        )}
                                    </Form.Select>

                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} md="3" controlId="formFile" className="mb-3">
                                    <Form.Label>???nh ch??nh</Form.Label>
                                    <Form.Control type="file"
                                        required
                                        name="mainImage"
                                        onChange={handleMainImage}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="formFile" className="mb-3">
                                    <Form.Label>???nh ph??? 1</Form.Label>
                                    <Form.Control type="file"
                                        required
                                        name="extraImage1"
                                        onChange={handleExtra1Image}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="formFile" className="mb-3">
                                    <Form.Label>???nh ph??? 2</Form.Label>
                                    <Form.Control type="file"
                                        required
                                        name="extraImage2"
                                        onChange={handleExtra2Image}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="formFile" className="mb-3">
                                    <Form.Label>???nh ph??? 3</Form.Label>
                                    <Form.Control type="file"
                                        required
                                        name="extraImage3"
                                        onChange={handleExtra3Image}
                                    />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} md="3" controlId="validationFormik01">
                                    <Form.Label>Gi?? kh???i ??i???m</Form.Label>
                                    <Form.Control
                                        required
                                        type="number"
                                        name="start_cost"
                                        min={10000} max={10000000}

                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Th???p nh???t: 10,000 v??  cao nh???t: 10,000,000
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>T???t!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="validationFormik01" onChange={handleStepCost}>
                                    <Form.Label>B?????c gi??</Form.Label>
                                    <Form.Select defaultValue="Ch???n b?????c gi??" onChange={(e) => setStepCost(e.target.value)}>
                                        <option value={100000}>100,000??</option>
                                        <option value={200000}>200,000??</option>
                                        <option value={500000}>500,000??</option>
                                    </Form.Select>
                                    <Form.Control.Feedback>T???t!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="3" controlId="validationFormik01">
                                    <Form.Label>Gi?? mua ngay(n???u c??)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="but_now"
                                        min={0} max={99999999}
                                    />
                                    <Form.Control.Feedback>T???t!</Form.Control.Feedback>
                                </Form.Group>


                            </Row>
                            <Row className='mb-3 mt-3'>
                                <Form.Group as={Col} md="3" >
                                    <Form.Label>Ng??y b???t ?????u ?????u gi??</Form.Label>
                                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                                </Form.Group>
                                <Form.Group as={Col} md="3" >
                                    <Form.Label>Th???i gian b???t ?????u </Form.Label>
                                    <TimePicker defaultValue={moment('00:00', timePickerFormat)}
                                        onChange={(time) => setStartTime(time)}
                                        selected={startTime}
                                        format={timePickerFormat} />
                                </Form.Group>
                                <Form.Group as={Col} md="3" >
                                    <Form.Label>Kho???ng th???i gian ?????u gi?? </Form.Label>
                                    <Form.Select defaultValue="Ch???n th???i gian" onChange={(e) => setDayCountAuction(e.target.value)}>
                                        <option value={3}>3 ng??y</option>
                                        <option value={5}>5 ng??y</option>
                                        <option value={7}>7 ng??y</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Row className='mb-3 mt-3'>
                                <Form.Group as={Col} md="3" id="formGridCheckbox">
                                    <Form.Check type="checkbox" label="T??? ?????ng gia h???n" name='auto_renew' onChange={handleAutoRenew} />
                                </Form.Group>
                            </Row>
                            <h6>M?? t??? s???n ph???m</h6>
                            <ReactQuill
                                onChange={setDescription}
                                value={description}
                                modules={modules}
                                formats={formats}
                                bounds={'.app'}
                                placeholder=''
                            />

                            <Row className='d-flex justify-content-center'>
                                <Button type="submit" className='mt-3 col-md-2'>????ng b??i</Button>
                            </Row>
                        </Form>
                    </Container>
                    <Footer/>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}