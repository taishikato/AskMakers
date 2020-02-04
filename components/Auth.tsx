import React from 'react'
import { useDispatch } from 'react-redux'
import auth from '../plugins/auth'
import getUnixTime from '../plugins/getUnixTime'
import getRedirectResult from '../plugins/getRedirectResult'
import { useRouter, NextRouter } from 'next/router'
import { loginUser, checkingLoginDone } from '../store/action'
import firebase from '../plugins/firebase'
import 'firebase/firestore'

const db = firebase.firestore()

const authUserFunc = async (router: NextRouter, dispatch) => {
  const authUser = await auth()
  if (!authUser) {
    dispatch(checkingLoginDone())
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
      dispatch(loginUser(newPublicUserData))
      dispatch(checkingLoginDone())
      router.push('/welcome')
    } else {
      const user = await publicUsersRef.get()
      dispatch(loginUser(user.data() as any))
      dispatch(checkingLoginDone())
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
  dispatch(loginUser(user.data() as any))
  dispatch(checkingLoginDone())
}

const Auth = props => {
  const router = useRouter()
  const dispatch = useDispatch()
  React.useEffect(() => {
    authUserFunc(router, dispatch);
  }, [])

  return props.children
}

export default Auth
