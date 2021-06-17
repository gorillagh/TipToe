import React, { useState, useEffect } from 'react'
import { viewSubCategories } from '../../serverFunctions/subCategory'
import { Link } from 'react-router-dom'

const Subcategories = () => {
  const [loading, setLoading] = useState(false)
  const [subcategories, setSubcategories] = useState([])

  useEffect(() => {
    setLoading(true)
    viewSubCategories().then((res) => {
      setSubcategories(res.data)
      setLoading(false)
    })
  }, [])

  const showSubcategories = () =>
    subcategories &&
    subcategories.length &&
    subcategories.map((subcategory) => (
      <Link
        key={subcategory._id}
        className='m-2'
        to={`subcategory/${subcategory.slug}`}
      >
        <div className='btn btn-outlined-primary btn-raised btn-block col text-info'>
          {subcategory.name}
        </div>
      </Link>
    ))

  return (
    <div>
      <div className='container-fluid m-0'>
        <h4
          style={{ background: '#FFA500' }}
          className='text-center  jumbotron p-2 m-0'
        >
          What are you looking for?
        </h4>
      </div>
      <div className='container pb-0 border'>
        <div className='row'>
          {loading ? (
            <h4 className='text-center text-danger'>Loading...</h4>
          ) : (
            showSubcategories()
          )}
        </div>
      </div>
    </div>
  )
}

export default Subcategories
