import { createStore, combineReducers } from 'redux'
import { LOGIN, LOGOUT, DONE_CHECKING } from './action'


export const initialState = {
  loginUser: {},
  isLogin: false,
  isCheckingLogin: true
}

const loginUser = (state = {}, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        uid: action.uid,
        name: action.name,
        picture: action.picture,
        username: action.username,
        badges: action.badges,
      }
      case LOGOUT:
        return {}
    default:
      return state
  }
}

const isLogin = (state = false, action: any) => {
  switch (action.type) {
    case LOGIN:
      return true
    case LOGOUT:
      return false
    default:
      return state
  }
}

const isCheckingLogin = (state = true, action: any) => {
  switch (action.type) {
    case DONE_CHECKING:
      return false
    default:
      return state
  }
}

const reducer = combineReducers({
  loginUser,
  isLogin,
  isCheckingLogin
})

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState
  )
}