import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LoadingOutlined } from '@ant-design/icons'
import AdminNav from '../../../components/Navbar/AdminNav'
import { getProducts, deleteProduct } from '../../../serverFunctions/product'
import AdminProductCard from '../../../components/Cards/AdminProductCard'

const AllProducts = () => {
  const { user } = useSelector((state) => ({ ...state }))
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  //Load the products
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setLoading(true)
    getProducts(100)
      .then((res) => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const handleDelete = (slug, title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      // console.log('send delete request', slug)

      deleteProduct(user.token, slug)
        .then((res) => {
          loadProducts()
          toast.error(`${res.data.title} Deleted`)
        })
        .catch((error) => {
          if (error.response.status === 4000) {
            toast.error(error.response.data)
            console.log(error)
          }
        })
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col my-3'>
          <header className='header'>
            {loading ? (
              <h1 className='text-center'>
                <LoadingOutlined />
              </h1>
            ) : (
              <h5 className='text-center'>Products</h5>
            )}
          </header>
          <hr />
          <div className='row'>
            {products.map((product) => {
              return (
                <div key={product._id} className='col p-2'>
                  <AdminProductCard
                    product={product}
                    handleDelete={handleDelete}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* {JSON.stringify(products.data[0].images[0].url)} */}
      </div>
    </div>
  )
}

export default AllProducts
