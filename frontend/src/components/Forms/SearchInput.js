import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'

const SearchInput = () => {
  const dispatch = useDispatch()
  const { search } = useSelector((state) => ({ ...state }))
  const { text } = search

  const history = useHistory()

  const handleChange = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: { text: e.target.value },
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    history.push(`/shop?${text}`)
  }

  return (
    <form className='form-inline my-2 my-md-0' onSubmit={handleSubmit}>
      <input
        value={text}
        className='form-control mr-sm-2'
        type='search'
        placeholder='Search'
        onChange={handleChange}
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
    </form>
  )
}

export default SearchInput
