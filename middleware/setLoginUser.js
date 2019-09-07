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
    // 公開情報と秘密情報を分けて保存
    // 公開
    const publicUsersRef = firestore
      .collection('publicUsers')
      .doc(result.user.uid)
    // 秘密
    const secretUsersRef = firestore
      .collection('secretUsers')
      .doc(result.user.uid)
    if (result.additionalUserInfo.isNewUser === true) {
      // Sign Up
      const userData = result.user
      const userUid = userData.uid
      const newPublicUserData = {
        uid: userUid,
        customName: userData.displayName,
        picture: userData.photoURL.replace('_normal', ''),
        social: {},
        username: result.additionalUserInfo.username,
        isEmailNewQuestionNotification: true
      }
      const newSecretUserData = {
        uid: userUid,
        displayName: userData.displayName,
        email: userData.email,
        created: getUnixTime(),
        provider: [result.additionalUserInfo.providerId],
        twitter: {
          accessToken: result.credential.accessToken,
          secret: result.credential.secret
        }
      }
      await Promise.all([
        saveDoc(publicUsersRef, newPublicUserData),
        saveDoc(secretUsersRef, newSecretUserData)
      ])
      store.commit('changeUser', {
        user: {
          uid: userUid,
          customName: userData.displayName,
          picture: userData.photoURL,
          social: {}
        }
      })

      await store.dispatch('BIND_USER', authUser)

      // Login Statusを変更
      store.commit('changeLoginStatus', {
        status: true
      })

      redirect('/welcome')
      return
    } else {
      // Log In
      const changeItem = {
        lastLogin: getUnixTime(),
        twitter: {
          accessToken: result.credential.accessToken,
          secret: result.credential.secret
        }
      }
      await updateDoc(secretUsersRef, changeItem)
      const userData = await publicUsersRef.get()
      store.commit('changeUser', {
        user: userData.data()
      })
      // Login Statusを変更
      store.commit('changeLoginStatus', {
        status: true
      })

      location.reload()
      return
    }
  }

  /**
   * 通常アクセスの場合
   */
  /**
   * ログイン状態チェック
   */
  // Firestoreとバインド
  await store.dispatch('BIND_USER', authUser)
  const user = await firestore
    .collection('publicUsers')
    .doc(authUser.uid)
    .get()
  store.commit('changeUser', {
    user: user.data()
  })
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
