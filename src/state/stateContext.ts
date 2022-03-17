import React, {useReducer} from 'react';
import {
  chatListItemType,
  ctxPassThroughType,
  friendItemType,
  stateType,
} from '../type/state_type';
import reducers from '../reducers';
import {ctxActionType} from '../type/actions_type';

type ctxReturn = [
  React.Context<ctxPassThroughType>,
  React.Dispatch<ctxActionType>,
  stateType,
];
// 全局状态树
const state: stateType = {
  isLogin: false,
  userInfo: {
    token: '',
    userID: '',
    username: '',
  },
  friendList: new Array<friendItemType>(),
  chatList: new Array<chatListItemType>(),
  TopChatList: new Array<chatListItemType>(),
  CurChatItem: {
    ChatID: '',
    RecentMsg: null,
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
