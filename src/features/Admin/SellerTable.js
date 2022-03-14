import AdminNav from '../../components/AdminNav';
import {
    getAccount,
    inferiorAccount,
    refreshAccount,
    selectSellers
} from './AdminSlice';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import memoize from 'memoize-one';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';
import axiosClient from '../../api/axiosClient';

export default function UserTable() {
    const [ sellers, setSellers ] = useState();
    const [reload, setReload] = useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);



    //call api ------------------------------------------------------------------------------------------------->
    function getAccount() {
        axiosClient
            .get(`/admin/account`)
            .then(function (res) {
                console.log(res.data)
                if (res.status === 200) {
                    setSellers(res.data.filter(user => user.role_id  === 2))
                }


            })
            .catch(function (error) {
                NotifyHelper.error(error, "Thông báo");
                console.log(error)
            });


    }

    function inferiorAccount(id) {
        axiosClient
            .patch(`/admin/account/inferior?account_id=${id}`)
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


    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);


    const contextActions = React.useMemo(() => {
        const handleDelete = () => {
            if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.name)}?`)) {
                setToggleCleared(!toggleCleared);
                const id = selectedRows[0].product_id;
                // dispatch(removeProduct(id));
                // dispatch(remove(id));
            }
        };

        return (
            <Button key="delete" onClick={handleDelete} style={{ backgroundColor: 'red' }} icon>
                Gỡ sản phẩm
            </Button>
        );
    }, [sellers, selectedRows, toggleCleared]);


    function clickHandler(e) {
        console.log(e)
        inferiorAccount(e);
    }



    const columns = [
        {
            cell: (row) => row.role_id === 2 ? <button onClick={() => clickHandler(row.account_id)}>Hạ cấp</button> : null,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'id',
            selector: row => row.account_id,
            sortable: true,
        },
        {
            name: 'Tên người dùng',
            selector: row => row.full_name,
            sortable: true,
        },
        {
            name: 'Giới tính',
            selector: row => row.Gender,
        },
        {
            name: 'Số điện thoại',
            selector: row => row.phone,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: 'Địa chỉ',
            selector: row => row.address,
        },
        {
            name: 'Điểm đánh giá',
            selector: row => row.evaluation_score,
            sortable: true,
        },
        {
            name: 'Loại tài khoản',
            selector: row => row.role_name,
            sortable: true,
        },
    ];

    useEffect(() => {
        getAccount();
    }, [reload]);

    useEffect(() => {
    }, [sellers]);

    console.log(sellers)
    return (
        <div className="container">
            <AdminNav />
            <DataTable
                title="Danh sách tài khoản người bán"
                columns={columns}
                data={sellers}
                //selectableRows
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
            />
        </div>
    )
}