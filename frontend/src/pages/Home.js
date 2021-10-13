import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CaretRightOutlined,
  CheckCircleOutlined,
  CarOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import ShowCaseCarousel from '../components/Home/ShowCaseCarousel'
import TypewriterHeader from '../components/Cards/TypewriterHeader'
import TopSelling from '../components/Home/TopSelling'
import TopIFans from '../components/Home/TopIFans'
import GamersCorner from '../components/Home/GamersCorner'
import { viewCategories } from '../serverFunctions/category'
import Subcategories from '../components/subcategory/Subcategories'

function Home() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = () => {
    viewCategories().then((res) => {
      setCategories(res.data)
    })
  }

  return (
    <>
      <header>
        <div className='container-sm text-center'>
          <h4
            // style={{ background: '#FFA500' }}
            style={{ background: '#183153', color: '#FAB005' }}
            className='jumbotron p-4 mb-0'
          >
            Available Now at TipToe:{' '}
            <span className='text-danger'>
              <TypewriterHeader
                style={{ display: 'inline' }}
                text={[
                  'Latest iPhones, Airpods, iWatch',
                  'PS4 & PS5 consoles, accessories',
                  'PS4 & PS5 games',
                  'Computer accessories',
                  'And many more...',
                ]}
              />
            </span>
          </h4>
        </div>
      </header>

      <section className='hero-section '>
        <div
          style={{ border: '1px solid #DCDEE3', borderRadius: '1%' }}
          className='container p-3'
        >
          <div className='row'>
            <div className='col-md-2'>
              <h5>CATEGORIES</h5>
              <hr />

              {categories && categories.length > 0 ? (
                categories.map((category) => {
                  return (
                    <Link key={category._id} to={`/category/${category.slug}`}>
                      <h6 className='hero-section-category mb-3'>
                        {category.name}
                        <CaretRightOutlined className='hero-section-category-pointer float-right mt-1' />
                      </h6>
                    </Link>
                  )
                })
              ) : (
                <p className='text-danger'>Loading categories...</p>
              )}
            </div>

            <ShowCaseCarousel />

            <div className='col-md-2 pl-0 d-none d-md-block'>
              <div
                style={{
                  width: '100%',
                  height: '0',
                  paddingBottom: '106%',
                  position: 'relative',
                }}
              >
                <iframe
                  title='iframe'
                  src='https://giphy.com/embed/RZRj3ax5oC4me9ASET'
                  width='100%'
                  height='100%'
                  style={{ position: 'absolute' }}
                  frameBorder='0'
                  className='giphy-embed'
                ></iframe>
              </div>
            </div>
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
            <div className='col-md-4 col-sm-4 px-5 py-3 text-center'>
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

            <div className='col-md-4 col-sm-4 px-5 py-3 text-center'>
              <h6>
                <SmileOutlined style={{ fontSize: '3rem', color: '#f44336' }} />
              </h6>
              <h6>Best Deals</h6>
              <p>Affordable prices for quality products like no other.</p>
            </div>

            <div className='col-md-4 col-sm-4 px-5 py-3 text-center'>
              <h6>
                <CarOutlined style={{ fontSize: '3rem', color: '#f44336' }} />
              </h6>
              <h6>Nationwide Delivery</h6>
              <p>We deliver to your doorstep wherever you are.</p>
            </div>
          </div>
        </div>
      </section>

      <hr className='my-1' />

      <section className='product-showcase m-0'>
        <TopSelling />
        <hr className='my-1' />
        <TopIFans />
        <hr className='my-1' />
        <GamersCorner />
      </section>
      <section className='sub-categories m-0'>
        <Subcategories />
      </section>
    </>
  )
}

export default Home
