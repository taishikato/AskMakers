import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { connect } from 'react-redux'
import { loginUser, logoutUser } from '../store/action'
import firebase from '../plugins/firebase'

const Navbar: NextPage<Props> = props => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isOpenDropDown, setIsOpenDropDown] = React.useState(false)
  const { isLogin, loginUser, signOut } = props

  const handleHumburger = () => {
    setIsOpen(!isOpen)
  }

  const handleDropDown = () => {
    setIsOpenDropDown(!isOpenDropDown)
  }

  return (
    <nav
      style={{ boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)' }}
      className="flex items-center justify-between flex-wrap px-6 py-4 text-white bg-gray-900"
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
          onClick={handleHumburger}
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
      <div
        className={`mt-4 md:p-0 md:mt-0 lg:mt-0 lg:p-0 lg:flex-grow lg:flex lg:items-center w-full lg:w-auto rounded z-50 ${(isOpen ? 'block': 'hidden')}`}
      >
        <div className="text-sm lg:flex-grow"></div>
        <div className="mt-4 lg:mt-0">
          {isLogin ?
            <div className="relative">
              <button onClick={handleDropDown} className="relative z-10 block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white">
                <img className="h-full w-full object-cover" src={loginUser.picture} alt={loginUser.name} />
              </button>
              <div className={`${(isOpenDropDown ? 'show' : 'hidden')} absolute z-40 right-0 mt-2 py-2 w-full md:w-48 lg:w-48 bg-white rounded-lg shadow-xl`}>
                {/* <span className="block px-4 py-2 text-gray-800"> */}
                <Link href="/[username]" as={`/${loginUser.username}`}>
                  <a className="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white">
                    Profile
                  </a>
                </Link>
                <Link href="/settings">
                  <a className="block px-4 py-2 text-gray-800 cursor-pointer hover:bg-indigo-500 hover:text-white">
                    Settings
                  </a>
                </Link>
                <a
                  onClick={signOut}
                  className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">
                  Sign out
                </a>
              </div>
            </div>
            :
            <Link href="/login">
              <a className="font-semibold">
                Sign up / Login
              </a>
            </Link>
          }
        </div>
      </div>
      {/* <style jsx>{`
      nav {
        height: 60px;
      }
      `}</style> */}
    </nav>
  )
}

interface Props {
  isLogin: boolean,
  loginUser: any,
  signOut: () => Promise<any>
}

const mapStateToProps = state => {
  return {
    isLogin: state.isLogin,
    loginUser: state.loginUser
  }
}

const mapDispachToProps = dispatch => {
  return {
    userLogin: () => {
      dispatch(loginUser({}))
    },
    signOut: async () => {
      await firebase.auth().signOut()
      dispatch(logoutUser())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispachToProps
)(Navbar)
