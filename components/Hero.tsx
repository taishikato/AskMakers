import React from 'react'
import { NextPage } from 'next'
import { connect } from 'react-redux'

const Hero: NextPage = props => {
  return (
    <div id="hero-container" className="py-12 h-auto">
      <div className="mx-auto flex flex-wrap flex-col md:flex-row items-center z-10 h-full w-full md:w-8/12 lg:w-8/12">
        <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
          <h1 className="my-4 text-3xl font-bold leading-tight">See the reviews on the vape devices and make better decisions.</h1>
          <h2 className="leading-normal text-xl mb-8">Vaping Astronaut is the place to post your reviews and see what others love.</h2>
        </div>
      </div>
      <style jsx>{`
        h1, h2 {
          text-shadow: 1px 1px #a0aec0;
        }
      `}</style>
    </div>
  )
}

export default Hero
