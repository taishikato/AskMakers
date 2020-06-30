import { createStore, combineReducers } from 'redux';
import { LOGIN, LOGOUT, DONE_CHECKING } from './action';
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';
import IPublicUser from '../interfaces/IPublicUser';

export const initialState = {
  loginUser: {},
  isLogin: false,
  isCheckingLogin: true,
};

export interface IInitialState {
  loginUser: IPublicUser;
  isLogin: boolean;
  isCheckingLogin: boolean;
}

const loginUser = (state = {}, action: any) => {
  switch (action.type) {
    case LOGIN:
      return {
        uid: action.uid,
        customName: action.customName,
        picture: action.picture,
        username: action.username,
        tagline: action.tagline,
        social: action.social,
        website: action.website,
      };
    case LOGOUT:
      return {};
    default:
      return state;
  }
};

const isLogin = (state = false, action: any) => {
  switch (action.type) {
    case LOGIN:
      return true;
    case LOGOUT:
      return false;
    default:
      return state;
  }
};

const isCheckingLogin = (state = true, action: any) => {
  switch (action.type) {
    case DONE_CHECKING:
      return false;
    default:
      return state;
  }
};

const reducer = combineReducers({
  loginUser,
  isLogin,
  isCheckingLogin,
});

export const initializeStore: MakeStore<IInitialState> = (
  preloadedState: Context
) => createStore(reducer);

export const wrapper = createWrapper<IInitialState>(initializeStore, {
  debug: false,
});
