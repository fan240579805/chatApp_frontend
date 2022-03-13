import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {chatRoomStyle} from './chatRoomStyle';
import BottomTool from './bottomTool';
import ChatBubble from './chatBubble';
import {
  bePushedMsgType,
  ctxPassThroughType,
  msgType,
} from '../../type/state_type';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import Icon from 'react-native-vector-icons/Ionicons';
import UploadImageBtn from '../../components/uploadImage';
import ModalCMP from '../../components/Modal';
import {API_PATH} from '../../const';
import {Context} from '../../state/stateContext';

interface Props {
  route: any;
  navigation: any;
}

const ChatRoom: React.FC<Props> = ({route, navigation}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const {chatID, recipient} = route.params;

  const [ContentHeight, setContentHeight] = useState(0);
  // 0 初始态 1 拉起键盘，2拉起emoji，3拉起工具栏
  const [bottomStatus, setBottomStatus] = useState(0);
  const [ToolHeight, setToolHeight] = useState(0);
  const [modalVisable, setModalVisable] = useState(false);
  const [isFirstScroll, setIsScroll] = useState(true);

  const childRef = useRef<any>(null);
  // 传递给子组件，为什么不在子组件直接关闭popup组件?
  // 因为每个组件useState独立，子组件只能控制自己的状态
  // 所以在父组件chatroom中封装好再回传给儿子
  // 这样就能借父组件的手关闭其他的popup
  const closePopup = () => {
    childRef!.current.changeShow(false);
  };

  // 消息列表，记得修改
  const [msgList, setMsgList] = useState<Array<msgType>>([]);
  const scrollContainer = useRef<any>(null);
  const inputCmpRef = useRef<any>(null);
  useEffect(() => {
    DeviceEventEmitter.addListener(
      'pushMsg',
      (bePushedObj: bePushedMsgType) => {
        const {Message, UserInfo} = bePushedObj;
        const messageItem: msgType = {
          msgid: Message.MsgID,
          content: Message.content,
          ownerid: UserInfo.UserID,
          type: Message.type,
          time: Message.time,
          isSender: Message.sender === state.userInfo.userID ? true : false,
          avatarUrl: UserInfo.Avatar,
        };
        const tempArr = [...msgList];
        tempArr.push(messageItem);
        setMsgList([...tempArr]);
      },
    );
  }, [msgList]);

  // 选择完emoji事件
  const selectEmojiHandle = (emoji: string) => {
    const {inputValue, setInputValue} = inputCmpRef.current;
    setInputValue(inputValue + emoji);
  };

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
          keyExtractor={msgItem => String(msgItem.msgid)}
          ref={scrollContainer}
          onContentSizeChange={() => {
            // 发消息时滚动到底部
            if (!isFirstScroll) {
              scrollContainer.current.scrollToEnd({animated: true});
            }
          }}
          // 滚动区域布局(高度)改变，自动滚到最底部
          onLayout={() => {
            if (scrollContainer) {
              // 初次渲染不带动画滚动到底部
              if (isFirstScroll) {
                scrollContainer.current.scrollToEnd({animated: false});
              } else {
                scrollContainer.current.scrollToEnd({animated: true});
              }
              setIsScroll(false);
            }
          }}
        />
      </View>
      <BottomTool
        chatID={chatID}
        recipient={recipient}
        ToolHeight={ToolHeight}
        bottomStatus={bottomStatus}
        setBottomStatus={setBottomStatus}
        setContentHeight={setContentHeight}
        inputCmpRef={inputCmpRef}
      />

      {bottomStatus === 2 && (
        <View
          style={[chatRoomStyle.bottomToolBody, {height: ToolHeight || '40%'}]}>
          <EmojiSelector
            category={Categories.emotion}
            showSectionTitles={false}
            showSearchBar={false}
            columns={10}
            onEmojiSelected={emoji => selectEmojiHandle(emoji)}
          />
        </View>
      )}
      {bottomStatus === 3 && (
        <View
          style={[
            chatRoomStyle.bottomToolBody,
            {height: ToolHeight || '40%', backgroundColor: '#e9e9e9'},
          ]}>
          <TouchableOpacity
            style={chatRoomStyle.toolBtn}
            onPress={() => setModalVisable(true)}>
            <Icon name="image-outline" color="#aaa" size={50} />
          </TouchableOpacity>
        </View>
      )}
      {/* 发送图片组件 */}
      <ModalCMP modalVisible={modalVisable} setModalVisible={setModalVisable}>
        <UploadImageBtn
          chatID={chatID}
          recipient={recipient}
          hasBtn={true}
          cRef={null}
          apiPath={API_PATH.UPLOAD_CHATIMG}
          setModalVisable={setModalVisable}
          AfterUploadCb={() => {}}
        />
      </ModalCMP>
    </View>
  );
};

export default ChatRoom;
