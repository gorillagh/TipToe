import React from 'react'
import StarRatings from 'react-star-ratings'

export const showAverageRating = (product, dimension) => {
  if (product && product.ratings) {
    let ratingsArray = product && product.ratings
    let total = []
    let length = ratingsArray.length

    ratingsArray.map((rating) => total.push(rating.star))

    let totalReduced = total.reduce((previous, next) => previous + next, 0)
    let highest = length * 5

    let result = (totalReduced * 5) / highest

    return (
      <div className='text-center p-2'>
        <span>
          <StarRatings
            name='rating'
            rating={result}
            numberOfStars={5}
            starRatedColor='red'
            starDimension={dimension}
            isSelectable={false}
            starSpacing='0.13rem'
            editing={false}
          />
        </span>{' '}
        {`(${result.toFixed(1)})`}
        <br />
        {length === 1 ? (
          <span>
            <small>{`Rated by ${length} person`}</small>
          </span>
        ) : (
          <span>
            <small>{`Rated by ${length} people`}</small>
          </span>
        )}
      </div>
    )
  }
}
