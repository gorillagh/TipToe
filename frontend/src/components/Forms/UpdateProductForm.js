import React from 'react'
import { Button, Select } from 'antd'

const { Option } = Select

const UpdateProductForm = ({
  handleChange,
  handleSubmit,
  values,
  loading,
  icon,
  // handleCategoryChange,
  // subCategories,
  // disableSubCategories,
  setValues,
}) => {
  const {
    title,
    description,
    price,
    quantity,
    sold,
    shipping,
    colors,
    color,
    brand,
    brands,
    categories,
    category,
    subcategories,
    images,
  } = values

  return (
    <form id='product-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          className='form-control mt-4'
          name='title'
          type='text'
          value={title}
          onChange={handleChange}
          required
        />
        <p className='label'>Title</p>
      </div>
      <div className='form-group'>
        <input
          className='form-control mt-4'
          name='description'
          type='text'
          value={description}
          onChange={handleChange}
          required
        />
        <p className='label'>Description</p>
      </div>
      <div className='row'>
        <div className='col-md-4 mt-3'>
          <div className='form-group'>
            <input
              className='form-control'
              name='price'
              type='number'
              value={price}
              onChange={handleChange}
              required
            />
            <p className='label'>Price</p>
          </div>
        </div>
        <div className='col-md-4 mt-3'>
          <div className='form-group'>
            <input
              className='form-control'
              name='quantity'
              type='number'
              value={quantity}
              onChange={handleChange}
              required
            />
            <p className='label'>Quantity</p>
          </div>
        </div>
        <div className='col-md-4 mt-3'>
          <div className='form-group'>
            <input
              className='form-control'
              name='sold'
              type='number'
              value={sold}
              onChange={handleChange}
              required
            />
            <p className='label'>Sold</p>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-4 mt-3'>
          <div className='form-group'>
            <label className='text-muted'>Shipping</label>
            <select
              value={shipping}
              className='custom-select'
              name='shipping'
              onChange={handleChange}
              required
            >
              <option value='Yes'>Yes</option>
              <option value='No'>No</option>
            </select>
          </div>
        </div>
        <div className='col-md-4 mt-3'>
          <div className='form-group'>
            <label className='text-muted'>Color</label>
            <select
              value={color}
              className='custom-select'
              name='color'
              onChange={handleChange}
              required
            >
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='col-md-4 mt-3'>
          <div className='form-group'>
            <label className='text-muted'>Brand</label>
            <select
              value={brand}
              className='custom-select'
              name='brand'
              onChange={handleChange}
              required
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='form-group mt-3'>
        <label className='text-muted'>Category</label>
        <select
          value={category}
          className='custom-select'
          name='category'
          // onChange={handleCategoryChange}
        >
          <option>--Select One--</option>
          {categories.length &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      {/* <div className='form-group mt-4'>
        <label className='text-muted'>Sub Categories</label>
        <Select
          mode='multiple'
          allowClear
          style={{ width: '100%' }}
          value={subcategories}
          onChange={(value) => setValues({ ...values, subcategories: value })}
          disabled={disableSubCategories || category === '--Select One--'}
          placeholder='Select Sub Categories'
        >
          {subCategories.length &&
            subCategories.map((s) => (
              <Option key={s._id} value={s._id}>
                {s.name}
              </Option>
            ))}
        </Select>
      </div> */}

      <div className='form-group mt-5'>
        <Button
          loading={loading}
          type='primary'
          shape='round'
          icon={icon}
          size='large'
          block
          onClick={handleSubmit}
          disabled={
            loading ||
            !title ||
            !description ||
            !price ||
            !quantity ||
            !sold ||
            shipping === '--Select One--' ||
            color === '--Select One--' ||
            brand === '--Select One--' ||
            category === '--Select One--' ||
            subcategories.length === 0 ||
            images.length === 0
          }
        >
          Save
        </Button>
      </div>
    </form>
  )
}

export default UpdateProductForm
