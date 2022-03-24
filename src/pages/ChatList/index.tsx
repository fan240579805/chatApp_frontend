import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, FlatList, ScrollView} from 'react-native';
import {wsInstance} from '../../network/websocket';
import ChatListItem from './listItem/ChatListItem';
import {Context} from '../../state/stateContext';
import {
  bePushedChatType,
  chatListItemType,
  ctxPassThroughType,
} from '../../type/state_type';
import {useGetData} from '../../network/getDataHook';
import {API_PATH, BASE_URL, stateStatus} from '../../const';
import {formatList} from '../../utils';
import {getValueFromStorage, StorageHasValue} from '../../utils/storage';
import {ctxActionType} from '../../type/actions_type';
import eventBus from '../../utils/eventBus';
interface Props {
  navigation: any;
}

const render = (
  navigation: any,
  ChatItem: chatListItemType,
  dispatch: React.Dispatch<ctxActionType>,
  isTop: boolean,
  index: number,
) => {
  return (
    <TouchableOpacity
      key={ChatItem.ChatID || index}
      onPress={() => {
        // 点击跳转前，dispatch分发chatInfo需要的数据，因为不这样比较难进行跨路由父子组件传值
        dispatch({
          type: stateStatus.SET_CHAT_DATA,
          playloads: ChatItem,
        });
        navigation.navigate('ChatRoomPage', {
          showTitle: ChatItem.ChatToNickName,
          isChangeTitle: true,
          chatID: ChatItem.ChatID,
          recipient: ChatItem.ChatToUserID,
        });
      }}>
      <ChatListItem {...ChatItem} isTop={isTop} />
    </TouchableOpacity>
  );
};

const ChatList: React.FC<Props> = ({navigation}) => {
  const [isRefresh, setRefresh] = useState(false);
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
      // 1. 缓存中看看是否有置顶chatIds, 有的话处理，无的话直接set
      StorageHasValue('topChatIds').then(hasValue => {
        if (hasValue) {
          getValueFromStorage('topChatIds').then(value => {
            const chatIds: string[] = JSON.parse(value);
            const topChatList = chatIds.map(chatId => {
              const i = chatList.findIndex(
                chatItem => chatItem.ChatID === chatId,
              );
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
    const listener = eventBus.addListener(
      'pushChatItem',
      (bePushedObj: bePushedChatType) => {
        const {Chat} = bePushedObj;
        const chatItem: chatListItemType = {
          ...Chat,
        };
        dispatch({type: stateStatus.NEW_MSG_CHATITEM, playloads: chatItem});
      },
    );
    return () => {
      listener.remove();
    };
  }, [state.chatList]);
  return (
    <>
      <ScrollView>
        {state.TopChatList.map((chat, index) => {
          return render(navigation, chat, dispatch, true, index);
        })}
        {state.chatList.map((chat, index) => {
          return render(navigation, chat, dispatch, false, index);
        })}
      </ScrollView>
    </>
  );
};

export default ChatList;
