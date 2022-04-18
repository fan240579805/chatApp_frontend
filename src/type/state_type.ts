import {ctxActionType} from './actions_type';

export interface userInfoType {
  token: string;
  userID: string;
  username: string;
  avatar: string;
}

export interface stateType {
  isLogin: boolean;
  userInfo: userInfoType;
  friendList: friendItemType[];
  chatList: chatListItemType[];
  TopChatList: chatListItemType[]; // 置顶了的聊天列表
  CurChatItem: chatListItemType;
  otherData: any; // 一些便于全局修改，共享的数据
}

export interface ctxPassThroughType {
  dispatch: React.Dispatch<ctxActionType>;
  state: stateType;
}

export interface msgType {
  msgid: string;
  ownerid: string;
  otherid: string;
  type: string;
  content: string;
  time: number;
  isSender: boolean;
  avatarUrl: string | undefined;
}

export interface message {
  MID: number;
  MsgID: string;
  content: string;
  recipient: string;
  sender: string;
  time: number;
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

// 服务器推送的聊天item数据类型
export interface bePushedChatType {
  DataType: string; // 区分websocket要推送的数据是好友类型还是消息类型
  BePushedID: string;
  Chat: chatListItemType;
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
  AddTime: number;
  IsMaster: boolean;
}

export interface chatListItemType {
  ChatID: string;
  UnRead: number;
  RecentMsg: message | null;
  ChatToNickName: string;
  ChatToUserID: string;
  ChatToUserAvatar: string;
  RecentTime: number;
}

export interface chatInfoType {
  chatID: string;
  recipient: string;
}
