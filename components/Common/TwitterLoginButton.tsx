import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

const TwitterLoginButton: React.FC<Props> = (props) => {
  return (
    <>
      <button
        onClick={props.handleLogin}
        className="p-2 flex items-center twitter text-white text-sm rounded font-semibold focus:outline-none w-full md:w-auto lg:w-auto"
      >
        <FontAwesomeIcon icon={faTwitter} size="xs" className="h-4 w-4 mr-2" />{' '}
        <span>Login With Twitter</span>
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
  handleLogin: () => void
}

export default TwitterLoginButton
