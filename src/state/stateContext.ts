import React, {useReducer} from 'react';
import {chatListItemType, ctxPassThroughType, friendItemType, msgType, stateType} from '../type/state_type';
import reducers from '../reducers';
import {ctxActionType} from '../type/actions_type';

type ctxReturn = [React.Context<ctxPassThroughType>, React.Dispatch<ctxActionType>, stateType];

// 全局状态树
const state: stateType = {
  isLogin: false,
  userInfo: {
    // 用户必要的个人信息，供全局组件取用
    token: '',
    userID: '',
    username: '',
    avatar: '',
  },
  friendList: new Array<friendItemType>(), // 好友列表
  chatList: new Array<chatListItemType>(), // 聊天会话列表
  TopChatList: new Array<chatListItemType>(), // 置顶列表
  CurChatItem: {
    ChatID: '',
    RecentMsg: null,
    UnRead: 0,
    ChatToNickName: '',
    ChatToUserID: '',
    ChatToUserAvatar: '',
    RecentTime: 0,
  },
  otherData: null,
};

// 暴露出全局统一的上下文
export const Context: any = React.createContext(null);
// 根组件自定义钩子，用于获取状态树以及dispatch函数
export function useCtxHook(): ctxReturn {
  const [newState, dispatch] = useReducer(reducers.contextReducer, state);
  return [Context, dispatch, newState];
}
