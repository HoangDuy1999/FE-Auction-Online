import AdminNav from '../../components/AdminNav';
import { 
    refreshAccount,
    selectSellers, 
    upgradeAccount,
    resetPassWord,
} from './AdminSlice';
import {  Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect,useState } from 'react';
import DataTable  from 'react-data-table-component';
import axios from 'axios';
import { NotifyHelper } from '../../helper/NotifyHelper';
import axiosClient from '../../api/axiosClient';

export default function BidderTable() {
    const sellers = useSelector(selectSellers);
    const [biiders,setBidders] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleCleared, setToggleCleared] = useState(false);
    const [reload, setReload] = useState(false);

    const dispatch = useDispatch();

    //call api ------------------------------------------------------------------------------------------------->
    function getAccount() {
        axiosClient
            .get(`/admin/account`,  )
            .then(function (res) {
                console.log(res.data)
                if (res.status === 200) {
                    setBidders(res.data.filter(user => user.role_id  === 1))
                }
            })
            .catch(function (error) {
                NotifyHelper.error(error, "Thông báo");
                console.log(error)
            });


    }

    function upgradeAccount(id) {
        axiosClient
            .patch(`/admin/account/upgrade?account_id=${id}`)
            .then(function (res) {
                //console.log(res)
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

    //---------------------------------------------------------------------------------------------------------->
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


    function clickHandler(e){
        //console.log(e)
        upgradeAccount(e);
    }

    function handleReserPassword(e){
        console.log(e)
        dispatch(resetPassWord(e));
    }

    const columns=[
        {
            cell: (row) => row.role_id === 1? <button onClick={()=>clickHandler(row.account_id)}>Nâng cấp</button>: null,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            cell: (row) => row.role_id === 1? <button onClick={()=>handleReserPassword(row.account_id)}>Reset MK</button>: null,
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
    ];

    //---------------------------------------------------------------------------------------------------------->
    useEffect(() => {
        getAccount();
    }, [reload]);

    useEffect(() => {
    }, [biiders]);

    return (
        <div className="container">
            <AdminNav/>
            <DataTable
                title="Danh sách tài khoản người mua"
                columns={columns}
                data={biiders}
                //selectableRows
                contextActions={contextActions}
                clearSelectedRows={toggleCleared}
                pagination
            />
        </div>
    )
}