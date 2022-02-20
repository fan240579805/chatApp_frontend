import {stateStatus} from '../const';
import {ctxActionType} from '../type/actions_type';
import {stateType} from '../type/state_type';

export function contextReducer(
  state: stateType,
  action: ctxActionType,
): stateType {
  switch (action.type) {
    case stateStatus.GET_LOGIN:
      return Object.assign({}, state);
    case stateStatus.TOGGLE_LOGIN:
      return Object.assign({}, state, {
        isLogin: action.playloads.isLogin,
      });
    case stateStatus.LOG_IN_AND_SIGN_IN:
      return {
        ...state,
        isLogin: true,
        userInfo: {...action.playloads.user},
      };
    case stateStatus.LOG_OUT:
      return {
        ...state,
        isLogin: false,
        userInfo: {
          userID: '',
          username: '',
          token: '',
        },
      };
    case stateStatus.SET_FRIENDLIST:
      return {
        ...state,
        friendList: [...action.playloads],
      };
    default:
      return {
        ...state,
      };
  }
}
