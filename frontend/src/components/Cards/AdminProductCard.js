import React from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import Picture from '../../images/favicon-32x32.png'

import { Popconfirm } from 'antd'

const AdminProductCard = ({ product, handleDelete }) => {
  const { Meta } = Card
  const { title, images, description, slug, price } = product

  return (
    <Card
      // className='mr-2 mb-3'
      hoverable
      style={{
        width: 180,
        borderRadius: '5% 5% 0 0',
        background: '#e1e5ea',
      }}
      cover={
        <Link to={`/admin/product/${slug}`}>
          <div
            style={{
              height: 180,
              borderRadius: '5% 5% 0 0',
              objectFit: 'cover',
            }}
          >
            <img
              style={{
                height: '100%',
                width: '100%',
                borderRadius: '5% 5% 0 0',
                objectFit: 'cover',
              }}
              alt='example'
              src={images && images.length ? images[0].url : Picture}
            />

            <h6 className='text-left ml-4 py-3'>
              Price: <span className='text-success'>GH¢ {price}</span>
            </h6>
          </div>
        </Link>
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <div>
            <span className='text-primary'>
              Edit <EditOutlined key='edit' />
            </span>
          </div>
        </Link>,

        <div>
          <Popconfirm
            title={`Are you sure to delete ${title}?`}
            onConfirm={() => handleDelete(slug, title)}
            // onCancel={cancel}
            okText='Yes'
            cancelText='No'
          >
            <span
              className='text-danger'
              // onClick={() => handleDelete(slug, title)}
            >
              Delete <DeleteOutlined key='delete' />
            </span>
          </Popconfirm>
        </div>,
      ]}
    >
      <Link to={`/admin/product/${slug}`}>
        <Meta
          style={{
            height: 110,
            marginTop: '25px',
            fontFamily: 'Ubuntu',
            fontWeight: 'normal',
          }}
          title={title}
          description={`${description && description.substring(0, 50)}...`}
        />
      </Link>
    </Card>
  )
}

export default AdminProductCard
