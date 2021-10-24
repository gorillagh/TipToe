import React from 'react'
import StarRatings from 'react-star-ratings'

const Star = ({ starClick, numberOfStars, starNoClick }) => {
  return (
    <>
      <StarRatings
        // changeRating={() => starClick(numberOfStars)}
        numberOfStars={numberOfStars}
        starDimension='25px'
        starSpacing='5px'
        starEmptyColor='#bea895'
        starHoverColor='black'
        starRatedColor='black'
        rating={starNoClick}
        changeRating={(newRating) => starClick(newRating)}
        isSelectable={true}
      />
      <br />
    </>
  )
}

export default Star
