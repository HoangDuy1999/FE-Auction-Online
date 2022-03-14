import { Button } from 'react-bootstrap';
import AdminNav from '../../components/AdminNav';
import { selectProducts, getProduct, removeProduct, remove, selectAllProducts,getAllProduct } from './AdminSlice';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { BsFillTrashFill } from 'react-icons/bs';
import { NotifyHelper } from '../../helper/NotifyHelper';
import Footer from '../../components/Footer';
import axiosClient from '../../api/axiosClient';

export default function ProductTable() {
    const [products, setProducts] = useState();
    const allProducts = useSelector(selectAllProducts);
    const [reload, setReload] = useState(false);
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);


    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);


    const contextActions = React.useMemo(() => {
        const handleDelete = () => {
            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
                setToggleCleared(!toggleCleared);
                const id = selectedRows[0].product_id;
                dispatch(removeProduct(id));
                //dispatch(remove(id));
            }
        };

        return (
            <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>
                Gỡ sản phẩm
            </Button>
        );
    }, [products, selectedRows, toggleCleared]);

    const columns = [
        {
            name: 'id',
            selector: row => row.product_id,
            sortable: true,
        },
        {
            name: 'Tên sản phẩm',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Người bán',
            selector: row => row.seller_name,
        },
        {
            name: 'Ngày tạo',
            selector: row => row.created_at,
            sortable: true,
        },
        {
            name: 'Danh mục',
            selector: row => row.type_name,
            sortable: true,
        },
        {
            cell: (row) => (<Button size="small" variant='danger' onClick={() => handleDelete(row.product_id)} ><BsFillTrashFill /></Button>),

            button: true,
        },
    ];

    const columns2 = [
        {
            name: 'id',
            selector: row => row.product_id,
            sortable: true,
        },
        {
            name: 'Tên sản phẩm',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Người bán',
            selector: row => row.seller_name,
        },
        {
            name: 'Ngày tạo',
            selector: row => row.created_at,
            sortable: true,
        },
        {
            name: 'Danh mục',
            selector: row => row.type_name,
            sortable: true,
        }
    ];
    //call api ------------------------------------------------------------------------------------------------->
    function handleDelete(id) {
        axiosClient
            .patch(`/admin/product/removeProduct?id=${id}`)
            .then(function (res) {
                console.log(res)
                if (res.status === 200) {
                    NotifyHelper.success(res.data.message, "Thông báo")
                    setReload(!reload);
                }
            })
            .catch(function (error) {
                NotifyHelper.error(error, "Thông báo");
                console.log(error)
            });
    }

    function getProduct() {
        axiosClient
            .get(`/admin/product`)
            .then(function (res) {
                console.log(res.data)
                if (res.status === 200) {
                   setProducts(res.data)
                }


            })
            .catch(function (error) {
                NotifyHelper.error(error, "Thông báo");
                console.log(error)
            });


    }
    useEffect(() => {
       getProduct();
       dispatch(getAllProduct());
    }, [reload]);

    //console.log(products)
    return (
        <div className="container">
            <AdminNav />
            <DataTable name='product-table'
                title="Danh sách các sản phẩm đang đấu giá"
                columns={columns}
                data={products}
                //selectableRows
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
            />
            <DataTable name='product-table'
                title="Danh sách tất cả các sản phẩm đấu giá"
                columns={columns2}
                data={allProducts}
                //selectableRows
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
            />
            <Footer />
        </div>

    )
}