import React from 'react'
import firebase from '../../plugins/firebase'
import TwitterLoginButton from '../Common/TwitterLoginButton'
import GoogleLoginButton from '../Common/GoogleLoginButton'
import FacebookLoginButton from '../Common/FacebookLoginButton'

const twitterProvider = new firebase.auth.TwitterAuthProvider()

const handleSignIn = () => {
  firebase.auth().signInWithRedirect(twitterProvider)
}

const SignUpModal = () => {
  return (
    <div className="p-5">
      <img
        src="/askmakers-300.png"
        alt="AskMakers logo"
        className="w-20 h-20 m-auto mb-4 rounded-full"
      />
      <p className="font-semibold text-xl text-center mb-2">
        Sign up on AskMakers
      </p>
      <p className="text-gray-700 font-light text-center m-auto mb-4 w-auto md:w-3/4 lg:w-3/4">
        Join a community of experienced makers and share your knowledge,
        discover the way to grow your product.
      </p>
      <div className="flex flex-wrap items-center justify-between">
        <TwitterLoginButton handleLogin={handleSignIn} />
        <GoogleLoginButton handleLogin={handleSignIn} />
        <FacebookLoginButton handleLogin={handleSignIn} />
      </div>
    </div>
  )
}

export default SignUpModal
