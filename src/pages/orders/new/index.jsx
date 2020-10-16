import React, { useCallback, useEffect, useState } from 'react'
import { Form, Spin, Input, Button } from 'antd';
import { useFetch } from '../../../hooks/useFetch'
import { useHistory } from 'react-router-dom'

const NewOrder = () => {
  const history = useHistory();
  const [body, setBody] = useState({
    title: '',
    descriptions: ''
  })
  const { title, descriptions } = body
  const { response, isLoading, error, send: createOrder } = useFetch('orders', { immediate: false }, { method: 'post' })
  const { response: users, isLoading: isLoadingUsers, error: usersError, send: getUsersFor } = useFetch('users', { immediate: false })
  const onSubmit = useCallback(async (values) => {
    const { title, email, descriptions } = values
    setBody({ title, descriptions })
    await getUsersFor({ params: { 'filter[email]': email } })
  })

  useEffect(() => {
    if (users) {
      const user = users[0]
      if (user && user.id) {
        const body = {
          title,
          descriptions,
          user_id: user.id
        }
        createOrder({ body: JSON.stringify(body) })
      } else {
        console.error('user not found')
      }
    }
  }, [users])

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not validate email!",
    }
  };

  useEffect(() => {
    if (response) {
      return history.push("/")
    }
  }, [response])

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
    <h2>Create New Order</h2>
    <Spin spinning={isLoading}>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        validateMessages={validateMessages}
        onFinish={onSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Order name"
          name="title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder={'COMPUTER-SET-A'} />
        </Form.Item>

        <Form.Item
          label="Create for"
          name="email"
          rules={[
            {
              required: true,
              type: 'email'
            },
          ]}
        >
          <Input placeholder={'ahmadfaridulazmi@gmail.com'} />
        </Form.Item>

        <Form.Item
          label="Descriptions"
          name="descriptions"
        >
          <Input placeholder={'New set of computers'} />
        </Form.Item>

        <Form.Item >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Button type="primary" onClick={() => history.push('/')} >Back</Button>
    </Spin>
    </>
  );
}
export default NewOrder;
