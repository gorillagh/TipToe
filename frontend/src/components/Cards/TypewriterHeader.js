import React from 'react'
import Typewriter from 'typewriter-effect'

const TypewriterHeader = ({ text }) => {
  return (
    <Typewriter
      options={{
        strings: text,
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  )
}

export default TypewriterHeader
