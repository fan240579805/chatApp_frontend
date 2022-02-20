import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import {getValueFromStorage} from '../../utils/storage';
import WebSocketClient from '../../network/websocket';
import ChatListItem from './listItem/ChatListItem';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType} from '../../type/state_type';
import {useGetData} from '../../network/getDataHook';
import {API_PATH, BASE_URL, stateStatus} from '../../const';
import {formatList} from '../../utils';
interface Props {
  navigation: any;
}

const render = (navigation, item) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChatRoomPage', {
          showTitle: String(item),
          isChangeTitle: true,
        });
      }}>
      <ChatListItem
        chatName={item}
        chatTime="21:50"
        showContent="你好"
        avatarUrl="https://reactnative.dev/img/tiny_logo.png"
      />
    </TouchableOpacity>
  );
};

const ChatList: React.FC<Props> = ({navigation}) => {
  const [isRefresh, setRefresh] = useState(false);
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
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
      const WS = new WebSocketClient();
      WS.initWebSocket(state.userInfo.userID);
    },
  });

  return (
    <FlatList
      data={[123, 13, 14, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99, 22]}
      renderItem={({item}) => render(navigation, item)}
      keyExtractor={item => String(item)}
      refreshing={isRefresh}
      onRefresh={() => console.log(1)}
    />
  );
};

export default ChatList;
