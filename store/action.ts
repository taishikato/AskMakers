export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const DONE_CHECKING = 'doneChecking'

export const loginUser = (user: any) => ({
  type: LOGIN,
  name: user.customName,
  uid: user.uid,
  picture: user.picture,
  username: user.username,
})
export const logoutUser = () => ({
  type: LOGOUT
})

export const checkingLoginDone = () => ({
  type: DONE_CHECKING
})