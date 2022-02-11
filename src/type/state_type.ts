import {ctxActionType} from './actions_type';

export interface userInfoType {
  token: string;
  userID: string;
  username: string;
}

export interface stateType {
  isLogin: boolean;
  userInfo: userInfoType;
}

export interface ctxPassThroughType {
  dispatch: React.Dispatch<ctxActionType>;
  state: stateType;
}

export interface msgType {
  id: number;
  type: string;
  content: string;
  time: string;
  isSender: boolean;
  avatarUrl: string;
}

export interface userProfileType {
  UserID: string;
  Username: string;
  Avatar: string;
  Email: string;
  NickName: string;
}
