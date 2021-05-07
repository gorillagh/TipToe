import React from 'react'
import { Button } from 'antd'

const CategoryForm = ({
  name,
  handleSubmit,
  loading,
  setName,
  buttonIcon,
  buttonTitle,
  placeholder,
}) => {
  return (
    <form className='mt-3' onSubmit={handleSubmit}>
      <div className='form-group'>
        <div className='input-group mb-3'>
          <input
            type='text'
            className='form-control'
            placeholder={placeholder}
            aria-label='Update category'
            aria-describedby='button-addon2'
            disabled={loading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className='input-group-append'>
            <Button
              type='primary'
              shape='round'
              disabled={!name}
              icon={buttonIcon}
              loading={loading}
              onClick={handleSubmit}
            >
              {buttonTitle}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CategoryForm
