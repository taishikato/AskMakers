import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
import 'firebase/firestore'
const firestore = firebase.firestore()
const usersRef = firestore.collection('users')

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {
      loginStatus: false,
      user: {} // Will be bound with firebase
    },
    getters: {
      getLoginStatus: (state) => {
        return state.loginStatus
      },
      getUserInfo: (state) => {
        return state.user
      }
    },
    mutations: {
      changeLoginStatus(state, isLogin) {
        state.loginStatus = isLogin.status
      },
      changeUser(state, data) {
        state.user = data.user
      },
      ...firebaseMutations
    },
    actions: {
      BIND_USER: firebaseAction(({ bindFirebaseRef }, user) => {
        bindFirebaseRef('user', usersRef.doc(user.uid))
      }),
      UNBIND_USER: firebaseAction(({ unbindFirebaseRef }) => {
        unbindFirebaseRef('user')
      })
    }
  })

export default store
