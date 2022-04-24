import {stateStatus} from '../const';
import {ctxActionType} from '../type/actions_type';
import {chatListItemType, friendItemType, stateType} from '../type/state_type';

const getTotalUnRead = (map: any): number => {
  let totalNum = 0;
  for (const key in map) {
    const element = map[key];
    totalNum += element;
  }
  return totalNum;
};

export function contextReducer(state: stateType, action: ctxActionType): stateType {
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
      console.log('exit');
      return {
        ...state,
        isLogin: false,
        chatList: new Array(),
        friendList: new Array(),
        TopChatList: [],
        otherData: null,
        CurChatItem: {
          ChatID: '',
          UnRead: 0,
          RecentMsg: null,
          RecentTime: 0,
          ChatToNickName: '',
          ChatToUserAvatar: '',
          ChatToUserID: '',
        },
        userInfo: {
          userID: '',
          username: '',
          token: '',
          avatar: '',
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

    case stateStatus.PUSH_FRIEND_ITEM:
      const tmpFriendList = [...state.friendList];
      const newFriendItem: friendItemType = action.playloads;
      const hasIndex = tmpFriendList.findIndex(fitem => fitem.FriendProfile?.UserID === newFriendItem.FriendProfile?.UserID);
      if (hasIndex !== -1) {
        tmpFriendList[hasIndex] = {...newFriendItem};
      } else {
        tmpFriendList.unshift(action.playloads);
      }
      return {
        ...state,
        friendList: [...tmpFriendList],
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
        prevChatList = prevChatList.filter(item => item.ChatID !== chatItem.ChatID);
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

      const preChatItemIndex = newChatList.findIndex(chatItem => chatItem.ChatID === newChatItem.ChatID);
      const preTopItemIndex = newTopList.findIndex(chatItem => chatItem.ChatID === newChatItem.ChatID);

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

      const index = tempTopList.findIndex(chatItem => chatItem.ChatID === newChat.ChatID);

      if (index === -1) {
        // 说明要更新的chatItem不再置顶list中，更新正常chatList
        const tmpChatList = preChatList.filter(chat => chat.ChatID !== newChat.ChatID);
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
    // 从列表移除当前会话框
    case stateStatus.REMOVE_CUR_CHAT:
      const curChatItem: chatListItemType = action.playloads;

      const filterTops = state.TopChatList.filter(citem => citem.ChatID !== curChatItem.ChatID);
      const filterNormals = state.chatList.filter(citem => citem.ChatID !== curChatItem.ChatID);
      return {
        ...state,
        TopChatList: [...filterTops],
        chatList: [...filterNormals],
      };

    case stateStatus.UPDATE_RECENT_MSG:
      const {curChatID, RecentMsg} = action.playloads;

      const curChatIndex = state.chatList.findIndex(chatItem => chatItem.ChatID === curChatID);
      // 当前要更新最近消息的会话是置顶列表
      const curTopChatIndex = state.TopChatList.findIndex(chatItem => chatItem.ChatID === curChatID);

      if (curChatIndex !== -1) {
        const willUpdateChatList = [...state.chatList];
        willUpdateChatList[curChatIndex].RecentMsg = RecentMsg;
        return {
          ...state,
          chatList: [...willUpdateChatList],
        };
      } else if (curTopChatIndex !== -1) {
        const willUpdateTopList = [...state.TopChatList];
        willUpdateTopList[curTopChatIndex].RecentMsg = RecentMsg;
        return {
          ...state,
          TopChatList: [...willUpdateTopList],
        };
      }

    // 设置拉黑数量
    case stateStatus.SET_BLACK_NUM:
      const preBlackNum = state?.otherData?.BlackNum || 0;
      return {
        ...state,
        otherData: {
          ...state.otherData,
          BlackNum: preBlackNum + action.playloads,
        },
      };

    case stateStatus.SUB_UNREAD_NUM:
      const _ChatItem: chatListItemType = action.playloads;
      const _map: Record<string, number> = state?.otherData?.unReadMap || {};

      if (_map[_ChatItem.ChatID]) {
        _map[_ChatItem.ChatID] -= _ChatItem.UnRead;
      } else {
        _map[_ChatItem.ChatID] = 0;
      }
      return {
        ...state,
        otherData: {
          ...state.otherData,
          unReadMap: _map,
          totalUnRead: getTotalUnRead(_map),
        },
      };

    case stateStatus.ADD_UNREAD_NUM:
      const _newChatItem: chatListItemType = action.playloads;
      const map: Record<string, number> = state?.otherData?.unReadMap || {};
      map[_newChatItem.ChatID] = _newChatItem.UnRead;
      return {
        ...state,
        otherData: {
          ...state.otherData,
          unReadMap: map,
          totalUnRead: getTotalUnRead(map),
        },
      };

    default:
      return {
        ...state,
      };
  }
}
