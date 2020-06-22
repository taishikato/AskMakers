import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

const FacebookLoginButton: React.FC<Props> = (props) => {
  return (
    <>
      <button
        onClick={props.handleLogin}
        className="p-2 flex items-center facebook text-white rounded text-sm font-semibold focus:outline-none hover:bg-gray-100 w-full md:w-auto lg:w-auto"
      >
        <FontAwesomeIcon icon={faFacebook} size="xs" className="h-4 w-4 mr-2" />{' '}
        Login With FaceBook
      </button>
      <style jsx>{`
        .facebook {
          background-color: #3b5998;
        }
        .facebook:hover {
          background-color: #4d72c1;
        }
      `}</style>
    </>
  )
}

interface Props {
  handleLogin: () => void
}

export default FacebookLoginButton
