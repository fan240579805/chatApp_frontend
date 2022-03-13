import {stateStatus} from '../const';
import {ctxActionType} from '../type/actions_type';
import {chatListItemType, stateType} from '../type/state_type';

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
    case stateStatus.SET_CHATLIST:
      return {
        ...state,
        chatList: [...action.playloads],
      };
    case stateStatus.APPEND_CHATITEM:
      const newChatList: chatListItemType[] = state.chatList;
      const newChatItem: chatListItemType = action.playloads;
      const preChatItemIndex = newChatList.findIndex(
        chatItem => chatItem.ChatID === newChatItem.ChatID,
      );
      if (preChatItemIndex !== -1) {
        newChatList[preChatItemIndex] = newChatItem;
      } else {
        newChatList.push(newChatItem);
      }
      return {
        ...state,
        chatList: [...newChatList],
      };
    default:
      return {
        ...state,
      };
  }
}
