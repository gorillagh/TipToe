import React from 'react'

import pic1 from '../../images/hero/pic1.webp'
import pic2 from '../../images/hero/pic1.jpg'
import pic3 from '../../images/hero/pic3.jpg'

const ShowCaseCarousel = () => {
  return (
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
          <li data-target='#carouselExampleIndicators' data-slide-to='1'></li>
          <li data-target='#carouselExampleIndicators' data-slide-to='2'></li>
        </ol>
        <div className='carousel-inner'>
          <div className='carousel-item active'>
            <img className='d-block w-100' src={pic1} alt='First slide' />
          </div>
          <div className='carousel-item'>
            <img className='d-block w-100' src={pic2} alt='Second slide' />
          </div>
          <div className='carousel-item'>
            <img className='d-block w-100' src={pic3} alt='Third slide' />
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
  )
}

export default ShowCaseCarousel
