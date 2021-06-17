import React from 'react'

import { Link } from 'react-router-dom'

const ProductListItems = ({ product }) => {
  const {
    price,
    category,
    subcategories,
    shipping,
    color,
    brand,
    quantity,
    sold,
  } = product
  return (
    <div>
      <div className='mb-3'></div>
      <ul className='p-0'>
        <li className='list-group-item border-top'>
          Price{' '}
          <span className='label label-default label-pill pull-xs-right text-success'>
            GHS {price}
          </span>
        </li>

        {category && (
          <li className='list-group-item border-top'>
            Category{' '}
            <Link
              to={`/category/${category.slug}`}
              className='label label-default label-pill pull-xs-right'
            >
              {category.name}
            </Link>
          </li>
        )}

        {subcategories && (
          <li className='list-group-item border-top'>
            Subcategories{' '}
            {subcategories.map((subcategory) => {
              return (
                <Link
                  key={subcategory._id}
                  to={`/subcategory/${subcategory.slug}`}
                  className='label label-default label-pill pull-xs-right'
                >
                  {subcategory.name}
                </Link>
              )
            })}
          </li>
        )}

        <li className='list-group-item border-top'>
          shipping{' '}
          <span className='label label-default label-pill pull-xs-right'>
            {shipping}
          </span>
        </li>

        <li className='list-group-item border-top'>
          Color{' '}
          <span className='label label-default label-pill pull-xs-right'>
            {color}
          </span>
        </li>

        <li className='list-group-item border-top'>
          brand{' '}
          <span className='label label-default label-pill pull-xs-right'>
            {brand}
          </span>
        </li>

        <li className='list-group-item border-top'>
          Availability{' '}
          <span className='label label-default label-pill pull-xs-right'>
            {quantity > 0 ? (
              <span className='text-success mr-0'>{`Yes(${quantity})`}</span>
            ) : (
              <span className='text-danger mr-0'>No</span>
            )}
          </span>
        </li>

        <li className='list-group-item border-top'>
          sold{' '}
          <span className='label label-default label-pill pull-xs-right'>
            {sold}
          </span>
        </li>
      </ul>
    </div>
  )
}

export default ProductListItems
