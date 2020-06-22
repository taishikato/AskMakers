import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

const GoogleLoginButton: React.FC<Props> = (props) => {
  return (
    <>
      <button
        onClick={props.handleLogin}
        className="p-2 flex items-center rounded font-semibold border text-sm border-gray-400 focus:outline-none hover:bg-gray-100 w-full md:w-auto lg:w-auto"
      >
        <FontAwesomeIcon icon={faGoogle} size="xs" className="h-4 w-4 mr-2" />{' '}
        <span>Login With Google</span>
      </button>
    </>
  )
}

interface Props {
  handleLogin: () => void
}

export default GoogleLoginButton
