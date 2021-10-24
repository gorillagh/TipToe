import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import UserNav from '../../components/Navbar/UserNav'
import { fetchOrders } from '../../serverFunctions/user'
import { Divider, Table } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import ShowPaymentInfo from '../../components/Cards/ShowPaymentInfo'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Invoice from '../../components/order/Invoice'

const UserHistory = () => {
  const [pdfReady, setPdfReady] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [detailedView, setDetailedView] = useState(true)
  const { user } = useSelector((state) => ({ ...state }))
  useEffect(() => {
    loadUserOrders()
    setPdfReady(true)
  }, [])
  const loadUserOrders = () => {
    setLoading(true)
    fetchOrders(user.token).then((res) => {
      setLoading(false)
      // console.log(JSON.stringify(res.data, null, 4))
      setOrders(res.data)
    })
  }

  const columns = [
    {
      title: 'DATE',
      dataIndex: 'DATE',
      key: 'DATE',
      render: (text) => <p className='text-primary'>{text}</p>,
    },

    {
      title: 'AMOUNT',
      dataIndex: 'AMOUNT',
      key: 'TOTAL AMOUNT',
    },
    {
      title: 'STATUS',
      dataIndex: 'STATUS',
      key: 'STATUS',
      render: (text) => (
        <span>
          {text !== 'Not Processed' ? (
            text !== 'Processing' ? (
              <span className='text-success'>{text}</span>
            ) : (
              <span className='text-info'>{text}</span>
            )
          ) : (
            <span className='text-danger'>{text}</span>
          )}
        </span>
      ),
    },
  ]

  const data = []
  orders.map((order) => {
    data.push({
      key: order._id,
      DATE: new Date(order.createdAt).toLocaleDateString(),
      AMOUNT: order.paymentIntent.amount,
      STATUS: order.orderStatus,
    })
    return 0
  })

  const showOrderInTable = (order) => {
    return (
      <table className='table table-bordered'>
        <thead className='thead-dark'>
          <tr>
            <th scope='col'>
              <small>
                <b>Product</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Price</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Brand</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Color</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Quantity</b>
              </small>
            </th>
            <th scope='col'>
              <small>
                <b>Shipping</b>
              </small>
            </th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => {
            return (
              <tr key={i}>
                <td>
                  <small>
                    <b>{p.product.title} </b>
                  </small>
                </td>
                <td>
                  <small>$ {p.product.price}</small>
                </td>
                <td>
                  <small>{p.product.brand}</small>
                </td>
                <td>
                  <small>{p.color}</small>
                </td>
                <td>
                  <small>{p.count}</small>
                </td>
                <td>
                  <small>
                    {p.product.shipping === 'Yes' ? (
                      <CheckCircleOutlined style={{ color: 'green' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: 'red' }} />
                    )}
                  </small>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  const showEachOrders = () =>
    orders.map((order, i) => {
      return (
        <div key={i} className='my-4 p-3 card border text-center'>
          <ShowPaymentInfo order={order} />
          {showOrderInTable(order)}
          <div className='row'>
            <div className='col'>{showDownloadLink(order)}</div>
          </div>
        </div>
      )
    })

  const showDownloadLink = (order) => {
    return (
      <>
        {/* check (Unhandled Rejection (Error): stream.push() after EOF) error */}
        {pdfReady && (
          <PDFDownloadLink
            className='btn btn-raised btn-outline-primary'
            document={<Invoice order={order} />}
            fileName='TipToe Invoice.pdf'
          >
            Download Receipt(PDF)
          </PDFDownloadLink>
        )}
      </>
    )
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col-md-8'>
          <Divider orientation='left'>
            <h5>
              Order History{' '}
              <span hidden={loading || orders.length < 1}>
                ({orders.length})
              </span>
            </h5>
          </Divider>
          <p hidden={loading} className='text-mute'>
            {orders.length > 0
              ? `You have ${orders.length} orders in your order history.`
              : 'You have NO orders in your order history'}
          </p>
          <div className='text-right'>
            <button
              hidden={loading}
              onClick={() => setDetailedView(!detailedView)}
              className='btn btn-raised btn-info'
            >
              {detailedView ? 'Summarized View' : 'Detailed View'}
            </button>
          </div>
          {loading ? (
            <h4 className='text-danger'>Loading...</h4>
          ) : !detailedView ? (
            <Table columns={columns} dataSource={data} />
          ) : (
            showEachOrders()
          )}
        </div>
      </div>
    </div>
  )
}

export default UserHistory
