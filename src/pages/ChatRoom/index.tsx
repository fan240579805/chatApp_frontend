import React, {useRef, useState} from 'react';
import {View, ScrollView, Text, FlatList, ListRenderItem} from 'react-native';
import {chatRoomStyle} from './chatRoomStyle';
import BottomTool from './bottomTool';
import ChatBubble from './chatBubble';
import {msgType} from '../../type/state_type';

interface Props {
  navigation: any;
}

const ChatRoom: React.FC<Props> = ({navigation}) => {
  const [ContentHeight, setContentHeight] = useState(0);
  // 0 初始态 1 拉起键盘，2拉起emoji，3拉起工具栏
  const [bottomStatus, setBottomStatus] = useState(0);
  const [ToolHeight, setToolHeight] = useState(0);

  const initMsgList: Array<msgType> = Array(20)
    .fill('')
    .map((item, index) => ({
      id: index + 1,
      time: new Date().toLocaleString(),
      type: 'image',
      isSender: index % 2 === 0,
      content:
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01d1035a9d4806a801206d9644f429.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644336518&t=2874190dda898f93da5af1322bdec8eb',
      avatarUrl:
        'https://img0.baidu.com/it/u=2991084227,3927319913&fm=26&fmt=auto',
    }));
  // 传递给子组件，为什么不在子组件直接关闭popup组件?
  // 因为每个组件useState独立，子组件只能控制自己的状态
  // 所以在父组件chatroom中封装好再回传给儿子
  // 这样旧能借父组件的手关闭其他的popup
  const closePopup = () => {
    childRef.current.changeShow(false);
  };
  // 消息列表，记得修改
  const [msgList, setMsgList] = useState<Array<msgType>>(initMsgList);

  const scrollContainer = useRef(null);
  const childRef = useRef(null);

  return (
    <View
      style={chatRoomStyle.container}
      // 点击其他区域隐藏小弹框
      onStartShouldSetResponder={() => {
        closePopup();
        return true;
      }}>
      <View
        style={
          [chatRoomStyle.chatContent, {height: ContentHeight || '90%'}] //根据输入框内容动态赋给聊天区域高度
        }>
        <FlatList
          data={msgList}
          renderItem={({item}) => (
            <ChatBubble
              {...item}
              closePopup={closePopup}
              cRef={childRef}
              navigation={navigation}
            />
          )}
          initialNumToRender={msgList.length}
          keyExtractor={msgItem => String(msgItem.id)}
          ref={scrollContainer}
          // 滚动区域布局(高度)改变，自动滚到最底部
          onLayout={() => {
            if (scrollContainer) {
              scrollContainer.current.scrollToEnd({animated: false});
            }
          }}
        />
      </View>
      <BottomTool
        ToolHeight={ToolHeight}
        bottomStatus={bottomStatus}
        setBottomStatus={setBottomStatus}
        setContentHeight={setContentHeight}
        setToolHeight={setToolHeight}
        scrollEnd={() => scrollContainer.current.scrollToEnd({animated: false})}
      />
      {bottomStatus === 2 && (
        <View
          style={[chatRoomStyle.bottomToolBody, {height: ToolHeight || '40%'}]}>
          <Text>emoji</Text>
        </View>
      )}
      {bottomStatus === 3 && (
        <View
          style={[chatRoomStyle.bottomToolBody, {height: ToolHeight || '40%'}]}>
          <Text>tool</Text>
        </View>
      )}
    </View>
  );
};

export default ChatRoom;
