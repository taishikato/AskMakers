import firebase from './firebase'

export default (): Promise<any> => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged((user) => {
      resolve(user || false)
    })
  })
}