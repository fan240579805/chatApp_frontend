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
    // 设置当前所在chat聊天的必要信息
    case stateStatus.SET_CHAT_DATA:
      return {
        ...state,
        CurChatItem: {...action.playloads},
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

    case stateStatus.SET_TOP_LIST:
      return {
        ...state,
        TopChatList: [...action.playloads],
      };
    case stateStatus.TOGGLE_TOP_LIST:
      let preTopList = state.TopChatList;
      let prevChatList = state.chatList;
      const {operFlag, chatItem} = action.playloads;
      if (!operFlag) {
        preTopList = preTopList.filter(item => item.ChatID !== chatItem.ChatID);
        prevChatList.push(chatItem);
      } else {
        preTopList.push(chatItem);
        prevChatList = prevChatList.filter(
          item => item.ChatID !== chatItem.ChatID,
        );
      }
      return {
        ...state,
        TopChatList: [...preTopList],
        chatList: [...prevChatList],
      };
    // 用于用户点击（开始聊天）按钮之后，更新chatList到首页
    case stateStatus.APPEND_CHATITEM:
      const newChatList: chatListItemType[] = state.chatList;
      const newTopList: chatListItemType[] = state.TopChatList;
      const newChatItem: chatListItemType = action.playloads;

      const preChatItemIndex = newChatList.findIndex(
        chatItem => chatItem.ChatID === newChatItem.ChatID,
      );
      const preTopItemIndex = newTopList.findIndex(
        chatItem => chatItem.ChatID === newChatItem.ChatID,
      );

      if (preChatItemIndex !== -1) {
        newChatList[preChatItemIndex] = newChatItem;
      } else if (preTopItemIndex !== -1) {
        newTopList[preTopItemIndex] = newChatItem;
        return {
          ...state,
          TopChatList: [...newTopList],
        };
      } else {
        // 既不在置顶list也不在常规chatList，说明是第一次点击发送聊天按钮，直接unshift
        newChatList.unshift(newChatItem);
      }
      return {
        ...state,
        chatList: [...newChatList],
      };
    // 被发送消息的人得到新的chat聊天框，更新chatList
    case stateStatus.NEW_MSG_CHATITEM:
      const preChatList: chatListItemType[] = state.chatList;
      const tempTopList: chatListItemType[] = state.TopChatList;
      const newChat: chatListItemType = action.playloads;

      const index = tempTopList.findIndex(
        chatItem => chatItem.ChatID === newChat.ChatID,
      );

      if (index === -1) {
        // 说明要更新的chatItem不再置顶list中，更新正常chatList
        const tmpChatList = preChatList.filter(
          chat => chat.ChatID !== newChat.ChatID,
        );
        tmpChatList.unshift(newChat);
        return {
          ...state,
          chatList: [...tmpChatList],
        };
      } else {
        // 要更新的chatItem在置顶List中
        tempTopList[index] = newChat;
        return {
          ...state,
          TopChatList: [...tempTopList],
        };
      }
    case stateStatus.SET_BLACK_NUM:
      const preBlackNum = state?.otherData?.BlackNum || 0;
      return {
        ...state,
        otherData: {
          ...state.otherData,
          BlackNum: preBlackNum + action.playloads,
        },
      };
    // 设置一些其他便于全局修改共享的数据
    case stateStatus.SET_OTHER_DATA:
      return {
        ...state,
        otherData: {...action.playloads},
      };
    default:
      return {
        ...state,
      };
  }
}
