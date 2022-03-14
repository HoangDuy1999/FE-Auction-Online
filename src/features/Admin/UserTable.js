import AdminNav from '../../components/AdminNav';
import {getAccount, 
    inferiorAccount, 
    selectAccounts, 
    refreshAccount,
    selectBidders,
    selectSellers 
} from './AdminSlice';
import {  Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import DataTable  from 'react-data-table-component';
import memoize from 'memoize-one';
import BidderTable from './BidderTable';

export default function UserTable() {
    const accounts = useSelector(selectAccounts);
    const sellers = useSelector(selectSellers);
    const biiders = useSelector(selectBidders);
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);

    useEffect(() => {
        dispatch(getAccount());
    }, [dispatch]);


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


    function clickHandler(e){
        console.log(e)
        
        dispatch(inferiorAccount(e));
        dispatch(refreshAccount(e));
       
    }

    const columns=[
        {
            cell: (row) => row.role_id === 2? <button onClick={()=>clickHandler(row.account_id)}>Hạ cấp</button>: null,
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

    return (
        <div className="container">
            <AdminNav/>
            <DataTable
                title="Danh sách tài khoản người bán"
                columns={columns}
                data={sellers}
                selectableRows
                contextActions={contextActions}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={toggleCleared}
                pagination
            />
        </div>
    )
}