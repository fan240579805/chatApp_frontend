import {ctxActionType} from './actions_type';

export interface userInfoType {
  token: string;
  userID: string;
  username: string;
}

export interface stateType {
  isLogin: boolean;
  userInfo: userInfoType;
  friendList: friendItemType | any;
}

export interface ctxPassThroughType {
  dispatch: React.Dispatch<ctxActionType>;
  state: stateType;
}

export interface msgType {
  msgid: string;
  ownerid: string;
  type: string;
  content: string;
  time: string;
  isSender: boolean;
  avatarUrl: string | undefined;
}

export interface message {
  ID: number;
  MsgID: string;
  content: string;
  recipient: string;
  sender: string;
  time: string;
  type: string;
  updatedat: string;
  createdat: string;
}

export interface bePushedMsgType {
  DataType: string; // 区分websocket要推送的数据是好友类型还是消息类型
  BePushedID: string;
  Message: message;
  UserInfo: userProfileType;
}

// 服务器推送的好友item数据类型
export interface bePushedFriendType {
  DataType: string; // 区分websocket要推送的数据是好友类型还是消息类型
  BePushedID: string;
  Friend: friendItemType;
}

export interface userProfileType {
  UserID: string;
  Username: string | undefined;
  Avatar: string | undefined;
  Email: string | undefined;
  NickName: string | undefined;
}

export interface friendItemType {
  FriendProfile: userProfileType | null;
  Status: number;
  AddTime: string;
  IsMaster: boolean;
}
