import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

const Navbar: NextPage = props => {
  return (
    <nav
      style={{ boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)' }}
      className="flex items-center justify-between flex-wrap px-6 py-5 text-white bg-gray-900	"
    >
      <div className="flex items-center flex-shrink-0 mr-6">
        <Link href="/">
          <a>
            Ask Makers
          </a>
        </Link>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:border-white"
        >
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="pt-4 md:p-0 lg:p-0 lg:flex-grow lg:flex lg:items-center w-full lg:w-auto">
        <div className="text-sm lg:flex-grow"></div>
        <div className="mt-4 lg:mt-0 font-semibold">
          <Link href="/login">
            <a>
              Sign up / Login
            </a>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
