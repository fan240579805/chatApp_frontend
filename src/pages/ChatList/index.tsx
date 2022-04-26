import React, {useContext, useEffect} from 'react';
import {TouchableOpacity, ScrollView} from 'react-native';
import {wsInstance} from '../../network/websocket';
import ChatListItem from './listItem/ChatListItem';
import {Context} from '../../state/stateContext';
import {bePushedChatType, chatListItemType, ctxPassThroughType, stateType} from '../../type/state_type';
import {useGetData} from '../../network/getDataHook';
import {API_PATH, BASE_URL, stateStatus} from '../../const';
import {formatList} from '../../utils';
import {getValueFromStorage, StorageHasValue} from '../../utils/storage';
import {ctxActionType} from '../../type/actions_type';
import eventBus from '../../utils/eventBus';
import {postData} from '../../network/postData';
import {RESP_TYPE} from '../../type/api_types';
interface Props {
  navigation: any;
}

const render = (
  navigation: any,
  ChatItem: chatListItemType,
  state: stateType,
  dispatch: React.Dispatch<ctxActionType>,
  isTop: boolean,
  index: number,
  resetUnReadToZero: (val: string) => Promise<void>, // 待补充
) => {
  // 当前最新消息的recipient是当前登录用户的话，说明未读消息是自己的
  const isMineUnread = ChatItem.RecentMsg!.recipient === state.userInfo.userID;
  return (
    <TouchableOpacity
      key={ChatItem.ChatID || index}
      onPress={() => {
        // 点击跳转前，dispatch分发chatInfo需要的数据，因为不这样比较难进行跨路由父子组件传值
        dispatch({
          type: stateStatus.SET_CHAT_DATA,
          playloads: ChatItem,
        });
        // 如果是自己的unread，跳转之前先发起请求，把该条chatID服务器db的unread置为0
        isMineUnread && resetUnReadToZero(ChatItem.ChatID);
        // 同时还把当前全局的未读数量 减掉
        isMineUnread &&
          dispatch({
            type: stateStatus.SUB_UNREAD_NUM,
            playloads: ChatItem,
          });

        navigation.navigate('ChatRoomPage', {
          showTitle: ChatItem.ChatToNickName,
          isChangeTitle: true,
          chatID: ChatItem.ChatID,
          recipient: ChatItem.ChatToUserID,
        });
      }}>
      <ChatListItem {...ChatItem} isTop={isTop} isMineUnread={isMineUnread} />
    </TouchableOpacity>
  );
};

const ChatList: React.FC<Props> = ({navigation}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  // 拉取聊天chatList
  useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_CHAT_LIST}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      // 请求成功处理一下data
      const chatList: chatListItemType[] = res;

      // 1. 缓存中看看是否有置顶disturbap, 有的话处理，无的话直接set
      StorageHasValue('disturbMap').then(hasValue => {
        if (hasValue) {
          getValueFromStorage('disturbMap').then(value => {
            const map: Record<string, boolean> = JSON.parse(value);
            for (const cid in map) {
              chatList.forEach((citem: chatListItemType) => {
                if (cid !== citem.ChatID) map[citem.ChatID] = false;
              });
            }
            dispatch({type: stateStatus.TOOGLE_DISTURB_STATUS, playloads: map});
          });
        } else {
          let _tempMap: Record<string, boolean> = {};
          chatList.forEach(c => {
            _tempMap[c.ChatID] = false;
          });
          dispatch({type: stateStatus.TOOGLE_DISTURB_STATUS, playloads: _tempMap});
        }
      });
      // 2. 根据免打扰计算整个chatList的未读数量
      chatList.forEach(cItem => {
        const isMineUnread = cItem.RecentMsg!.recipient === state.userInfo.userID;
        if (isMineUnread) {
          // 将所有的 chatList 的正确未读数量设置到全局中
          dispatch({
            type: stateStatus.ADD_UNREAD_NUM,
            playloads: cItem,
          });
        }
      });
      // 3. 缓存中看看是否有置顶chatIds, 有的话处理，无的话直接set
      StorageHasValue('topChatIds').then(hasValue => {
        if (hasValue) {
          getValueFromStorage('topChatIds').then(value => {
            const chatIds: string[] = JSON.parse(value);
            const topChatList = chatIds.map(chatId => {
              const i = chatList.findIndex(chatItem => chatItem.ChatID === chatId);
              const tempCaht = chatList[i];
              chatList.splice(i, 1); // 从chatList移除掉在置顶List中的item
              return tempCaht;
            });

            // 2. dispatch处理TopChatList
            dispatch({type: stateStatus.SET_TOP_LIST, playloads: topChatList});
            // 3. 处理未置顶Chat
            dispatch({type: stateStatus.SET_CHATLIST, playloads: chatList});
          });
        } else {
          dispatch({type: stateStatus.SET_CHATLIST, playloads: chatList});
        }
      });
    },
  });
  // 在这里拉取好友列表的目的是，他是首页，加载首屏数据易于理解
  useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_FRIENDLIST}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      // 请求成功处理一下data
      // 更新数据成功后将新数据 dispatch分发给父组件以便页面同步新改的数据
      dispatch({type: stateStatus.SET_FRIENDLIST, playloads: formatList(res)});
      wsInstance.initWebSocket(state.userInfo.userID);
    },
  });
  // 获取拉黑list（长度）
  useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_BLACK_LIST}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      dispatch({type: stateStatus.SET_BLACK_NUM, playloads: res.length});
    },
  });

  useEffect(() => {
    const listener = eventBus.addListener('pushChatItem', (bePushedObj: bePushedChatType) => {
      const {Chat} = bePushedObj;
      const chatItem: chatListItemType = {
        ...Chat,
      };
      const isMineUnread = Chat.RecentMsg!.recipient === state.userInfo.userID;

      dispatch({type: stateStatus.NEW_MSG_CHATITEM, playloads: chatItem});
      isMineUnread &&
        dispatch({
          type: stateStatus.ADD_UNREAD_NUM,
          playloads: chatItem,
        });
    });
    return () => {
      listener.remove();
    };
  }, [state.chatList]);

  // 发起请求将chat未读消息归零
  const resetUnReadToZero = async (chatid: string) => {
    try {
      const resp = await postData(`${BASE_URL}${API_PATH.RESET_UNREAD}`, {
        ChatID: chatid,
        token: state.userInfo.token,
      });
      const res: RESP_TYPE = await resp.json();
      if (res.code === 200) {
        dispatch({type: stateStatus.NEW_MSG_CHATITEM, playloads: res.data});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ScrollView>
        {state.TopChatList.map((chat, index) => {
          return render(navigation, chat, state, dispatch, true, index, resetUnReadToZero);
        })}
        {state.chatList.map((chat, index) => {
          return render(navigation, chat, state, dispatch, false, index, resetUnReadToZero);
        })}
      </ScrollView>
    </>
  );
};

export default ChatList;
