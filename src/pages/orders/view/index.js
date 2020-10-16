import React from "react";
import {Button, Space, Spin, Table} from "antd";
import { useParams, useHistory } from "react-router-dom";
import {useFetch} from "../../../hooks/useFetch";

const ViewOrder = () => {
    const { id } = useParams();
    const history = useHistory()
    const { response: order, isLoading, error } = useFetch('orders/:id', { id })
    const { response: logs, isLoading: isLoadingLogs, error: errorLogs } = useFetch('orders/:id/payment_logs', { id })

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Card number',
            key: 'card_number',
            render: (text, record) => (
                <Space size="middle">
                    { JSON.parse(record.user_credentials || {})?.card_number }
                </Space>
            ),
        },
        {
            title: 'States',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Process payment at',
            dataIndex: 'created_at',
            key: 'created_at'
        }
    ]

    return (
        <>
            <h2>Orders: { order?.title }</h2>
            <Spin spinning={isLoading || isLoadingLogs}>
                <Table dataSource={logs} columns={columns} rowKey='id' />
            </Spin>
            <Button type="primary" onClick={() => history.push('/')} >Back</Button>
        </>
    )
}
export default ViewOrder;
