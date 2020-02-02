export const LOGIN = 'login'
export const LOGOUT = 'logout'
export const DONE_CHECKING = 'doneChecking'

export const loginUser = (user: any) => ({
  type: LOGIN,
  customName: user.customName,
  uid: user.uid,
  picture: user.picture,
  username: user.social.twitter,
  tagline: user.tagline,
  website: user.website,
  social: user.social
})
export const logoutUser = () => ({
  type: LOGOUT
})

export const checkingLoginDone = () => ({
  type: DONE_CHECKING
})