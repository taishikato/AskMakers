import React from 'react'
import { connect } from 'react-redux'
import auth from '../plugins/auth'
import getUnixTime from '../plugins/getUnixTime'
import getRedirectResult from '../plugins/getRedirectResult'
import { useRouter, NextRouter } from 'next/router'
import { loginUser, checkingLoginDone } from '../store/action'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const authUserFunc = async (userLogin: any, isLogin: any, router: NextRouter, checkingLoginDoneAction) => {
  const authUser = await auth()
  if (!authUser && router.pathname === '/create-review/[slug]') {
    checkingLoginDoneAction()
    return router.push('/sign')
  }
  if (!authUser) {
    checkingLoginDoneAction()
    return
  }
  const result = await getRedirectResult()
  if (result.user !== null) {
    // 公開
    const publicUsersRef = db
      .collection('publicUsers')
      .doc(result.user.uid)
    // 秘密
    const secretUsersRef = db
      .collection('secretUsers')
      .doc(result.user.uid)
    if (result.additionalUserInfo.isNewUser) {
      const created = getUnixTime()
      // Sign Up
      // ユーザー保存
      const userData = result.user
      const userUid = userData.uid
      const newPublicUserData: any = {
        uid: userUid,
        customName: userData.displayName,
        social: {
          twitter: result.additionalUserInfo.username
        },
        username: result.additionalUserInfo.username,
        picture: userData.photoURL.replace('_normal', ''),
        created,
        tagline: result.additionalUserInfo.profile.description
      }

      const newSecretUserData = {
        uid: userUid,
        email: userData.email,
        created,
        provider: [result.additionalUserInfo.providerId],
      }
      await Promise.all([
        publicUsersRef.set(newPublicUserData),
        secretUsersRef.set(newSecretUserData)
      ])
      userLogin(newPublicUserData)
      checkingLoginDoneAction()
      router.push('/welcome')
    } else {
      console.log({result})
      const user = await publicUsersRef.get()
      userLogin(user.data() as any)
      checkingLoginDoneAction()
      // router.push('/')
      router.push('/welcome')
    }
    return
  }
  // 通常アクセス
  const user = await db
    .collection('publicUsers')
    .doc(authUser.uid)
    .get()
  userLogin(user.data() as any)
  checkingLoginDoneAction()
}

const Auth = props => {
  const router = useRouter()
  React.useEffect(() => {
    authUserFunc(props.userLogin, props.isLogin, router, props.checkingLoginDoneAction);
  }, [])

  return props.children
}

const mapStateToProps = state => {
  return {
    isLogin: state.isLogin
  }
}

const mapDispachToProps = dispatch => {
  return {
    userLogin: (user) => {
      dispatch(loginUser(user))
    },
    checkingLoginDoneAction: () => {
      dispatch(checkingLoginDone())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispachToProps
)(Auth)
