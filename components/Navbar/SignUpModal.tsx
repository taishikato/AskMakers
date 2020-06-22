import React from 'react'
import firebase from '../../plugins/firebase'
import 'firebase/auth'
import TwitterLoginButton from '../Common/TwitterLoginButton'
import GoogleLoginButton from '../Common/GoogleLoginButton'
import FacebookLoginButton from '../Common/FacebookLoginButton'

const twitterProvider = new firebase.auth.TwitterAuthProvider()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider()

const handleTwitterSignIn = () =>
  firebase.auth().signInWithRedirect(twitterProvider)
const handleGoogleSignIn = () =>
  firebase.auth().signInWithRedirect(googleProvider)
const handleFacebookSignIn = () =>
  firebase.auth().signInWithRedirect(facebookProvider)

const SignUpModal = () => {
  return (
    <div className="p-5 bg-white rounded">
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
        <TwitterLoginButton handleLogin={handleTwitterSignIn} />
        <GoogleLoginButton handleLogin={handleGoogleSignIn} />
        <FacebookLoginButton handleLogin={handleFacebookSignIn} />
      </div>
      <p className="text-center text-gray-600 text-xs font-light mt-2">
        We'll never post to any of your accounts without your permission.
      </p>
    </div>
  )
}

export default SignUpModal
