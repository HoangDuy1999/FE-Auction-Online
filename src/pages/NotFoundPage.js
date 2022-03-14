import React from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className='container'>
        <div className='container col-md-5'>
            <div className='card  mt-5 p-4'  >
                <Col>
                    <h1>404 - Not Found!</h1>
                    <Link to="/">
                        Go Home
                    </Link>
                </Col>
            </div>
        </div>

    </div>
);

export default NotFoundPage;