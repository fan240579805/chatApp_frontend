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
  SET_CHAT_DATA = 'SET_CHAT_DATA',

  SET_FRIENDLIST = 'SET_FRIENDLIST',

  SET_CHATLIST = 'SET_CHATLIST',
  SET_TOP_LIST = 'SET_TOP_LIST',
  TOGGLE_TOP_LIST = 'TOGGLE_TOP_LIST',
  APPEND_CHATITEM = 'APPEND_CHATITEM',
  NEW_MSG_CHATITEM = 'NEW_MSG_CHATITEM',

  SET_OTHER_DATA = 'SET_OTHER_DATA',
  SET_BLACK_NUM = 'SET_BLACK_NUM',
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
  // 更新用户信息api地址
  UPDATE_USERINFO = 'api/updateUserInfo',
  MODIFY_PWD = 'api/modifypwd',
  MODIFY_USRNAME = 'api/modifyusrname',
  UPLOAD_IMG = 'api/uploadImg',
  MODIFY_AVATAR = 'api/modifyAvatar',

  // 搜索，操作好友api地址
  SEARCH_USER = 'api/searchUser',
  ADD_FRIEND = 'api/addFriendReq',
  ACCEPT_FRIEND = 'api/acceptFriendReq',
  REJECT_FRIEND = 'api/rejectFriendReq',
  TAKE_BLACK = 'api/takeBlack',
  CANCEL_BLACK = 'api/cancelBlack',
  GET_BLACK_LIST = 'api/getBlackList',
  GET_BLACK_STATUS = 'api/getBlackStatus',
  DELETE_FRIEND = 'api/deleteFriendReq',
  BOTH_DEL_FRIEND = 'api/bothDelFriend',

  // 聊天相关api地址
  UPLOAD_CHATIMG = 'api/uploadChatImg',
  GET_CHAT_LIST = 'api/getChatList',
  MAKE_CHAT = 'api/makeChat',

  WS = 'api/ws',
  AJAX = 'api/AJAX',
  HELLO = 'api/hello',
}
