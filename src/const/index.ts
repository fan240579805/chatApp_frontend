export enum fetchStatus {
  INIT = 'FETCH_INIT',
  SUCCESS = 'FETCH_SUCCESS',
  ERROR = 'FETCH_ERROR',
}

export enum stateStatus {
  GET_LOGIN = 'GET_LOGIN',
  TOGGLE_LOGIN = 'TOGGLE_LOGIN',
  RESTORE_TOKEN = 'RESTORE_TOKEN',
  LOG_IN_AND_SIGN_IN = 'LOG_IN_AND_SIGN_IN',
  LOG_OUT = 'LOG_OUT',
  NO_TOKEN = 'NO_TOKEN',
}

// export const BASE_URL = 'http://127.0.0.1:9998/';
export const BASE_URL = 'http://192.168.43.142:9998/';
// export const BASE_URL = 'http://192.168.43.216:9998/';
// export const BASE_URL = 'http://10.43.15.107:9998/'; 


export const WEBSOCKET_URL = 'ws://192.168.43.142:9998/';

export enum API_PATH {
  LOGIN = 'api/login',
  REGISTER = 'api/Registerauth',
  AUTH_TOKEN = 'api/AuthToken',

  GET_USERINFO = 'api/userInfo',
  GET_FRIENDLIST = 'api/getFriendList',

  UPDATE_USERINFO = 'api/updateUserInfo',
  MODIFY_PWD = 'api/modifypwd',
  MODIFY_USRNAME = 'api/modifyusrname',
  UPLOAD_IMG = 'api/uploadImg',
  MODIFY_AVATAR = 'api/modifyAvatar',

  SEARCH_USER = 'api/searchUser',
  ADD_FRIEND = 'api/addFriendReq',
  ACCEPT_FRIEND = 'api/acceptFriendReq',
  REJECT_FRIEND = 'api/rejectFriendReq',


  WS = 'api/ws',
  AJAX = 'api/AJAX',
  HELLO = 'api/hello',
}
