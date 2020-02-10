import React from 'react'
import { NextPage } from 'next'
import { useSelector } from 'react-redux'
import AskNowButton from './AskNowButton'

const Hero: NextPage = () => {
  const isLogin = useSelector(state => state.isLogin)
  return (
    <div id="hero-container" className="py-12 h-auto bg-cover text-white px-3 md:px-0 lg:px-0">
      <div className="mx-auto flex flex-wrap flex-col md:flex-row items-center z-10 h-full w-full md:w-9/12 lg:w-9/12">
        <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left lg:text-left">
          <h1 className="my-4 text-3xl font-bold leading-tight">Ask experienced makers questions.</h1>
          <h2 className="leading-normal text-xl mb-8">The best place to ask experienced and successful makers questions.</h2>
          {!isLogin &&
          <div className="m-auto md:m-0 lg:m-0">
            <AskNowButton />
          </div>
          }
        </div>
      </div>
      <style jsx>{`
        #hero-container {
          background-image: url('./heroBg.png');
        }
      `}</style>
    </div>
  )
}

export default Hero
