import React, { useEffect, useState } from 'react'
import { getProducts } from '../serverFunctions/product'
import ProductCard from '../components/Cards/productCard'
import {
  CaretRightOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import pic1 from '../images/hero/pic1.webp'
import pic2 from '../images/hero/pic1.jpg'
import pic3 from '../images/hero/pic3.jpg'
import TypewriterHeader from '../components/Cards/TypewriterHeader'

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setLoading(true)
    getProducts(4)
      .then((res) => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  return (
    <>
      <header className='text-center'>
        <div className='container-sm mt-3'>
          <h4 className='jumbotron p-4'>
            Available Now at TipToe:{' '}
            <span className='text-danger'>
              <TypewriterHeader
                style={{ display: 'inline' }}
                text={[
                  'Latest iPhones, Airpods, iWatch',
                  'Playstation 4 & 5 consoles and accessories',
                  'Playstation 4 & 5 games',
                  'Computer accessories',
                  'And many more...',
                ]}
              />
            </span>
          </h4>
        </div>
      </header>

      <section className='hero-section mt-3 '>
        <div style={{ border: '1px solid #DCDEE3' }} className='container p-4'>
          <div className='row'>
            <div className='col-md-2'>
              <h5>CATEGORIES</h5>
              <hr />
              <Link to='/'>
                <h6
                  style={{
                    fontSize: '0.875rem',
                    color: '#333333',
                    lineHeight: '1.25rem',
                  }}
                  className='mb-3'
                >
                  iPhones{' '}
                  <CaretRightOutlined
                    className='float-right mt-1'
                    style={{ fontSize: '0.7rem' }}
                  />
                </h6>
              </Link>
              <Link to='/'>
                <h6
                  style={{
                    fontSize: '0.875rem',
                    color: '#333333',
                    lineHeight: '1.25rem',
                  }}
                  className='mb-3'
                >
                  Laptops{' '}
                  <CaretRightOutlined
                    className='float-right mt-1'
                    style={{ fontSize: '0.7rem' }}
                  />
                </h6>
              </Link>
              <Link to='/'>
                <h6
                  style={{
                    fontSize: '0.875rem',
                    color: '#333333',
                    lineHeight: '1.25rem',
                  }}
                  className='mb-3'
                >
                  Game consoles{' '}
                  <CaretRightOutlined
                    className='float-right mt-1'
                    style={{ fontSize: '0.7rem' }}
                  />
                </h6>
              </Link>
              <Link to='/'>
                <h6
                  style={{
                    fontSize: '0.875rem',
                    color: '#333333',
                    lineHeight: '1.25rem',
                  }}
                  className='mb-3'
                >
                  Games{' '}
                  <CaretRightOutlined
                    className='float-right mt-1'
                    style={{ fontSize: '0.7rem' }}
                  />
                </h6>
              </Link>
              <Link to='/'>
                <h6
                  style={{
                    fontSize: '0.875rem',
                    color: '#333333',
                    lineHeight: '1.25rem',
                  }}
                  className='mb-3'
                >
                  Computer Accessories{' '}
                  <CaretRightOutlined
                    className='float-right mt-1'
                    style={{ fontSize: '0.7rem' }}
                  />
                </h6>
              </Link>
              <Link to='/'>
                <h6
                  style={{
                    fontSize: '0.875rem',
                    color: '#333333',
                    lineHeight: '1.25rem',
                  }}
                  className='mb-3'
                >
                  Phone Accessories{' '}
                  <CaretRightOutlined
                    className='float-right mt-1'
                    style={{ fontSize: '0.7rem' }}
                  />
                </h6>
              </Link>
            </div>

            <div className='col-md-8'>
              <div
                id='carouselExampleIndicators'
                className='carousel slide'
                data-ride='carousel'
              >
                <ol className='carousel-indicators'>
                  <li
                    data-target='#carouselExampleIndicators'
                    data-slide-to='0'
                    className='active'
                  ></li>
                  <li
                    data-target='#carouselExampleIndicators'
                    data-slide-to='1'
                  ></li>
                  <li
                    data-target='#carouselExampleIndicators'
                    data-slide-to='2'
                  ></li>
                </ol>
                <div className='carousel-inner'>
                  <div className='carousel-item active'>
                    <img
                      className='d-block w-100'
                      src={pic1}
                      alt='First slide'
                    />
                  </div>
                  <div className='carousel-item'>
                    <img
                      className='d-block w-100'
                      src={pic2}
                      alt='Second slide'
                    />
                  </div>
                  <div className='carousel-item'>
                    <img
                      className='d-block w-100'
                      src={pic3}
                      alt='Third slide'
                    />
                  </div>
                </div>
                <a
                  className='carousel-control-prev'
                  href='#carouselExampleIndicators'
                  role='button'
                  data-slide='prev'
                >
                  <span
                    className='carousel-control-prev-icon'
                    aria-hidden='true'
                  ></span>
                  <span className='sr-only'>Previous</span>
                </a>
                <a
                  className='carousel-control-next'
                  href='#carouselExampleIndicators'
                  role='button'
                  data-slide='next'
                >
                  <span
                    className='carousel-control-next-icon'
                    aria-hidden='true'
                  ></span>
                  <span className='sr-only'>Next</span>
                </a>
              </div>
            </div>

            <div className='col-md-3'></div>
          </div>
        </div>
      </section>

      <section className='feature-section my-3'>
        <div
          style={{
            borderTop: '1px solid #DCDEE3',
            borderBottom: '1px solid #DCDEE3',
          }}
          className='container p-2'
        >
          <div className='row'>
            <div className='col-md-4 px-5 py-3 text-center'>
              <h6>
                <CheckCircleOutlined
                  style={{ fontSize: '3rem', color: '#f44336' }}
                />
              </h6>
              <h6>Trusted brand</h6>
              <p>
                Trust us to give you only original products from your favourite
                brands.
              </p>
            </div>

            <div className='col-md-4 px-5 py-3 text-center'>
              <h6>
                <SmileOutlined style={{ fontSize: '3rem', color: '#f44336' }} />
              </h6>
              <h6>Best Deals</h6>
              <p>Affordable prices for quality products like no other.</p>
            </div>

            <div className='col-md-4 px-5 py-3 text-center'>
              <h6>
                <CarOutlined style={{ fontSize: '3rem', color: '#f44336' }} />
              </h6>
              <h6>Nationwide Delivery</h6>
              <p>We deliver to your doorstep wherever you are.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className='jumbotron p-2'>
          <h4 className='text-center '>New Arrivals</h4>
        </div>

        <div className='container'>
          <div className='row'>
            {products.map((product) => (
              <div key={product._id} className='col-md-3 p-3'>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
