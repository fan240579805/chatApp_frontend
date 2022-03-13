import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import {wsInstance} from '../../network/websocket';
import ChatListItem from './listItem/ChatListItem';
import {Context} from '../../state/stateContext';
import {
  chatListItemType,
  ctxPassThroughType,
  stateType,
} from '../../type/state_type';
import {useGetData} from '../../network/getDataHook';
import {API_PATH, BASE_URL, stateStatus} from '../../const';
import {formatList} from '../../utils';
interface Props {
  navigation: any;
}

const render = (navigation: any, ChatItem: chatListItemType) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChatRoomPage', {
          showTitle: ChatItem.ChatToNickName,
          isChangeTitle: true,
          chatID: ChatItem.ChatID,
          recipient: ChatItem.ChatToUserID,
        });
      }}>
      <ChatListItem {...ChatItem} />
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
      dispatch({type: stateStatus.SET_CHATLIST, playloads: res});
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

  return (
    <FlatList
      data={state.chatList}
      renderItem={({item}) => render(navigation, item)}
      keyExtractor={item => item.ChatID}
      refreshing={isRefresh}
      onRefresh={() => console.log(1)}
    />
  );
};

export default ChatList;
