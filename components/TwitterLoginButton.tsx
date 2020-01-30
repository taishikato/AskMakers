import React from 'react'

const TwitterLoginButton = () => {
  return (
    <>
      <button className="p-3 twitter text-white rounded font-semibold focus:outline-none">
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

export default TwitterLoginButton
