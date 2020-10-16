import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, Spin, Button, Space } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useFetch } from '../../../hooks/useFetch'

const OrderList = () => {
  const history = useHistory()
  const { response, isLoading, send: refreshOrderList } = useFetch('orders')
  const { response: responseDelete, isLoading: isLoadingDelete, error: errorDelete, send: deleteOrderFor } = useFetch('orders/:id', { immediate: false }, { method: 'delete' })
  const { response: responseRetryPayment, isLoading: isLoadingRetryPayment, error: errorRetryPayment, send: retryPaymentFor } = useFetch('orders/:id/retry_payment', { immediate: false }, { method: 'post' })
  const [data, setData] = useState([])

  useEffect(() => {
    if (response) {
      setData(response.map(res => {
        return {
          key: res.id,
          ...res
        }
      }))
    }
  }, [response])

  useEffect(() => {
    if (responseDelete || responseRetryPayment) {
      refreshOrderList();
    }
  }, [responseDelete, responseRetryPayment])

  const deleteOrder = useCallback(async e => {
    let id = e.target.getAttribute("data-id");
    await deleteOrderFor({ id });
  })

  const retryPaymentOrder = useCallback(async e => {
    let id = e.target.getAttribute("data-id");
    await retryPaymentFor({ id });
  })

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Order',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'States',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Process payment at',
      dataIndex: 'payment_at',
      key: 'payment_at'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => history.push(`/orders/${record.id}`)} >View</a>
          <a onClick={deleteOrder} data-id={record.id} >Delete</a>
          {record.status === 'cancelled' && <a onClick={retryPaymentOrder} data-id={record.id} >Retry Payment</a> }
        </Space>
      ),
    }
  ]

  return (
    <>
      <h2>Your Orders</h2>
      <Spin spinning={isLoading || isLoadingDelete}>
        <Table dataSource={data} columns={columns} />
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => history.push('/orders/new')} >Create New Order</Button>
      </Spin>
    </>
  )
}

export default OrderList
