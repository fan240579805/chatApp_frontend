import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import {getValueFromStorage} from '../../utils/storage';
import WebSocketClient from '../../network/websocket';
import ChatListItem from './listItem/ChatListItem';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType} from '../../type/state_type';
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
  // const WS = new WebSocketClient();
  // console.log(state);
  // WS.initWebSocket(state.userInfo.userID);

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
