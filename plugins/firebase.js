import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDYEn7zIIDX9jqXDrToNwBPsJ0g0Hxn7tw',
    authDomain: 'ask-makers.firebaseapp.com',
    databaseURL: 'https://ask-makers.firebaseio.com',
    projectId: 'ask-makers',
    storageBucket: 'ask-makers.appspot.com',
    messagingSenderId: '811327399022',
    appId: '1:811327399022:web:60a82580178913a0'
  })
}
export default firebase
