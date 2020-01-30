import React from 'react'
import { NextPage } from 'next'

const TwitterLoginButton: NextPage<Props> = props => {
  return (
    <>
      <button
        onClick={props.handleLogin}
        className="p-3 twitter text-white rounded font-semibold focus:outline-none"
      >
        Login With Twitter
      </button>
      <style jsx>{`
      .twitter {
        background-color: rgb(90, 164, 235);
      }
      .twitter:hover {
        background-color: #3182ce;
      }
      `}</style>
    </>
  )
}

interface Props {
  handleLogin: any
}

export default TwitterLoginButton
