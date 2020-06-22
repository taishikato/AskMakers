import React, { useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { logoutUser } from '../store/action'
import firebase from '../plugins/firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import {
  InstantSearch,
  Hits,
  connectStateResults,
  Configure,
} from 'react-instantsearch-dom'
import algoliasearch from 'algoliasearch/lite'
import SearchHit from './SearchHit'
import CustomSearchBox from './CustomSearchBox'
import Modal from 'react-modal'
import SignUpModal from './Navbar/SignUpModal'

const Navbar: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDropDown, setIsOpenDropDown] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const isLogin = useSelector((state) => state.isLogin)
  const loginUser = useSelector((state) => state.loginUser)
  const dispatch = useDispatch()
  const router = useRouter()

  const signOut = async () => {
    await firebase.auth().signOut()
    dispatch(logoutUser())
    router.push('/')
  }

  const handleHumburger = () => {
    setIsOpen(!isOpen)
  }

  const handleDropDown = () => {
    setIsOpenDropDown(!isOpenDropDown)
  }

  const handleAskButtonClick = (e) => {
    e.preventDefault()
    if (!isLogin) {
      router.push('/login')
      return
    }
    router.push('/ask-question')
  }

  const searchClient = algoliasearch(
    'XZIR7RVDZD',
    'ba8ffe5c871cb0ebae6e7c04762a2048'
  )

  const Content = connectStateResults(({ searchState, searchResults }) => {
    if (searchResults && searchResults.nbHits !== 0 && searchState.query) {
      return (
        <div className="w-11/12 md:w-4/12 lg:w-4/12 mt-1 border-gray-200 rounded border absolute bg-white z-40">
          <Hits hitComponent={SearchHit} />
        </div>
      )
    } else if (
      searchResults &&
      searchResults.nbHits === 0 &&
      searchState.query
    ) {
      return (
        <div className="text-white">
          No results has been found for {searchState.query}
        </div>
      )
    } else {
      return <div></div>
    }
  })

  return (
    <>
      <nav
        style={{ boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.06)' }}
        className="flex items-center justify-between flex-wrap px-6 py-4 text-white bg-gray-900"
      >
        <div className="flex items-center flex-shrink-0 mr-6">
          <Link href="/">
            <a className="font-extrabold text-green-400">AskMakers</a>
          </Link>
        </div>
        <div className="block lg:hidden">
          <button
            onClick={handleHumburger}
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:border-white focus:outline-none"
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
          className={`mt-4 md:p-0 md:mt-0 lg:mt-0 lg:p-0 lg:flex-grow lg:flex lg:items-center w-full lg:w-auto rounded z-50 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="text-sm lg:flex-grow text-gray-700">
            <InstantSearch searchClient={searchClient} indexName="questions">
              {/* <SearchBox defaultRefinement="" /> */}
              <Configure hitsPerPage={5} />
              <CustomSearchBox />
              <Content />
            </InstantSearch>
          </div>
          <button
            onClick={handleAskButtonClick}
            className="font-semibold focus:outline-none flex flex-wrap items-center mr-5 pt-3 md:pt-0 lg:pt-0"
          >
            <FontAwesomeIcon icon={faPlus} size="xs" className="h-3 w-3" />
            <span className="ml-1">Ask Question</span>
          </button>
          <div className="mt-4 lg:mt-0">
            {isLogin ? (
              <div className="relative">
                <button
                  onClick={handleDropDown}
                  className="relative z-10 block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white"
                >
                  <img
                    className="h-full w-full object-cover"
                    src={loginUser.picture}
                    alt={loginUser.name}
                  />
                </button>
                <div
                  className={`${
                    isOpenDropDown ? 'show' : 'hidden'
                  } absolute z-40 right-0 mt-2 py-2 w-full md:w-48 lg:w-48 bg-white rounded-lg shadow-xl`}
                >
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
                    className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            ) : (
              // <Link href="/login">
              <a
                className="font-semibold cursor-pointer"
                onClick={() => setIsSignupModalOpen(true)}
              >
                Sign up / Login
              </a>
              // </Link>
            )}
          </div>
        </div>
      </nav>
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setIsSignupModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            padding: '1.25rem',
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        {/* <SignupForm closeModal={() => setIsSignupModalOpen(false)} /> */}
        <SignUpModal />
      </Modal>
    </>
  )
}

export default Navbar
