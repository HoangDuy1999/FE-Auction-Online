import AdminNav from '../../components/AdminNav';
import { getWaitUpgrade, selectWaitUpgrade, upgradeAccount,removeWaitAccount } from './AdminSlice';
import {  Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import memoize from 'memoize-one';

export default function WaitUpgrade() {
    const accounts = useSelector(selectWaitUpgrade);
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);

   
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
    }, [accounts, selectedRows, toggleCleared]);

    function clickHandler(e){
        console.log(e)
        dispatch(upgradeAccount(e));
        dispatch(removeWaitAccount(e));
       
    }

    const columns=[
        {
            cell: (row) => <button key='upgrade' onClick={()=>clickHandler(row.account_id)}>Nâng cấp</button>,
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



    useEffect(() => {
        dispatch(getWaitUpgrade());
    }, [dispatch]);
    
    return (
        <div className="container">
            <AdminNav/>
            <DataTable name='wait-upgrade-table'
                title="Danh sách tài khoản bidder chờ nâng cấp thành seller"
                columns={columns}
                data={accounts}
                selectableRows
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
            />
           
        </div>
        
    )
}