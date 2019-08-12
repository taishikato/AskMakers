/* eslint-disable no-console */
import auth from '~/plugins/auth'
// import getDoc from '~/plugins/getDoc'
import saveDoc from '~/plugins/saveDoc'
import getUnixTime from '~/plugins/getUnixTime'
import updateDoc from '~/plugins/updateDoc'
import getRedirectResult from '~/plugins/getRedirectResult'
import firebase from '~/plugins/firebase'
// Use firestore
import 'firebase/firestore'
const firestore = firebase.firestore()

export default async ({ store, redirect }) => {
  const authUser = await auth()
  if (authUser === false) return

  /**
   * Sign Up / Log In
   */
  const result = await getRedirectResult()
  if (result.user !== null) {
    const usersRef = firestore.collection('users').doc(result.user.uid)
    if (result.additionalUserInfo.isNewUser === true) {
      console.log(result)
      // Sign Up
      const userData = result.user
      const userUid = userData.uid
      const newUserData = {
        uid: userUid,
        displayName: userData.displayName,
        customName: userData.displayName,
        email: userData.email,
        created: getUnixTime(),
        picture: userData.photoURL,
        provider: [result.additionalUserInfo.providerId]
      }
      await saveDoc(usersRef, newUserData)
    } else {
      // Log In
      const changeItem = {
        lastLogin: getUnixTime()
      }
      await updateDoc(usersRef, changeItem)
    }
    await store.dispatch('BIND_USER', authUser)
    // Login Statusを変更
    store.commit('changeLoginStatus', {
      status: true
    })
    return
  }

  /**
   * 通常アクセスの場合
   */
  /**
   * ログイン状態チェック
   * すでにログインしている場合は、再度Vuexに設定する必要はないため終了
   */
  const isLogin = store.getters.getLoginStatus
  if (isLogin === true) return

  console.log(authUser)

  // Firestoreとバインド
  await store.dispatch('BIND_USER', authUser)
  // Login Statusを変更
  store.commit('changeLoginStatus', {
    status: true
  })
  // Userを変更
  // const usersRef = firestore.collection('users').doc(authUser.uid)
  // const getUserResult = await getDoc(usersRef)
  // let newUserData = {}
  // if (getUserResult.exists === false) {
  //   // Sign Up
  //   newUserData = {
  //     uid: authUser.uid,
  //     displayName: authUser.displayName,
  //     customName: userData.displayName,
  //     email: authUser.email,
  //     created: getUnixTime(),
  //     picture: authUser.photoURL
  //   }
  //   await saveDoc(usersRef, newUserData)
  // } else {
  //   // Sign In
  //   newUserData = getUserResult.data()
  // }

  // store.commit('changeUser', {
  //   user: newUserData
  // })
  // Login Statusを変更
  // store.commit('changeLoginStatus', {
  //   status: true
  // })
}
