import React from 'react'

const SearchFilter = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault()
    setKeyword(e.target.value.toLowerCase())
  }
  return (
    <form>
      <input
        type='text'
        className='form-control'
        placeholder='Filter search'
        aria-label='Filter search'
        value={keyword}
        onChange={handleSearchChange}
      />
    </form>
  )
}

export default SearchFilter
