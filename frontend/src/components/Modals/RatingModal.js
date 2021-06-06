import React from 'react'
import { Modal, Button } from 'antd'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import { StarOutlined } from '@ant-design/icons'

const RatingModal = ({
  children,
  handleStarOk,
  handleStarCancel,
  loading,
  isModalVisible,
  setIsModalVisible,
}) => {
  const history = useHistory()
  const { slug } = useParams()
  const { user } = useSelector((state) => ({ ...state }))

  const handleModal = () => {
    if (user && user.token) {
      setIsModalVisible(true)
    } else {
      history.push({
        pathname: '/login',
        state: { from: `/product/${slug}` },
      })
    }
  }

  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined className='text-danger' />
        <br />
        {user ? 'Rate Product' : 'Log in to leave rate product'}
      </div>

      <Modal
        title='Product Rating'
        centered
        visible={isModalVisible}
        onOk={handleStarOk}
        onCancel={handleStarCancel}
        footer={[
          <Button key='Cancel' onClick={handleStarCancel}>
            Cancel
          </Button>,
          <Button
            key='OK'
            type='primary'
            loading={loading}
            onClick={handleStarOk}
          >
            OK
          </Button>,
        ]}
      >
        {children}
      </Modal>
    </>
  )
}

export default RatingModal
