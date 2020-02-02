import React from 'react'
import { NextPage } from 'next'

const Button: NextPage<Props> = props => {
  const { text, handleClick } = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

interface Props {
  text: string,
  handleClick: any
}

export default Button
