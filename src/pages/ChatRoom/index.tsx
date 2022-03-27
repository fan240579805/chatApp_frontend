import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {chatRoomStyle} from './chatRoomStyle';
import BottomTool from './bottomTool';
import ChatBubble from './chatBubble';
import {
  bePushedMsgType,
  ctxPassThroughType,
  message,
  msgType,
} from '../../type/state_type';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import Icon from 'react-native-vector-icons/Ionicons';
import UploadImageBtn from '../../components/uploadImage';
import ModalCMP from '../../components/Modal';
import {API_PATH, BASE_URL} from '../../const';
import {Context} from '../../state/stateContext';
import {msgReducer, MsgStatus} from '../../reducers/msgListReducer';
import eventBus from '../../utils/eventBus';
import usePostData from '../../network/postDataHook';
import {postData} from '../../network/postData';

interface Props {
  route: any;
  navigation: any;
}

const ChatRoom: React.FC<Props> = ({route, navigation}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const {chatID, recipient} = route.params;

  const [canChat, setCanChat] = useState(true);

  const [pageIndex, setpageIndex] = useState(0);

  const scrollContainer = useRef<any>(null);

  // 消息列表
  const [msgState, dispatchMsg] = useReducer(msgReducer, {
    msgList: new Array<msgType>(),
  });

  const [setReqData, setURL] = usePostData({
    initUrl: '',
    initData: {},
    initReqData: {
      token: state.userInfo.token,
    },
    successCbFunc: res => {
      res !== '' && setCanChat(res);
    },
  });

  const [setMsgReqData, setMsgURL] = usePostData({
    initUrl: `${BASE_URL}${API_PATH.GET_MSG_LIST}`,
    initData: {},
    initReqData: {
      Myself: state.userInfo.userID,
      Other: state.CurChatItem.ChatToUserID,
      PageIndex: pageIndex,
      token: state.userInfo.token,
    },
    successCbFunc: res => {
      console.log(res);
      const messageList: Array<msgType> = res.map((mItem: message) => {
        const isSender = mItem.sender === state.userInfo.userID;
        return {
          msgid: mItem.MsgID,
          content: mItem.content,
          ownerid: mItem.sender,
          otherid: mItem.recipient,
          type: mItem.type,
          time: mItem.time,
          isSender: isSender,
          avatarUrl: isSender
            ? state.userInfo.avatar
            : state.CurChatItem.ChatToUserAvatar,
        };
      });
      if (pageIndex === 0) {
        dispatchMsg({type: MsgStatus.SET_CUR_MSG_LIST, playloads: messageList});
        setpageIndex(1);
      } else {
        dispatchMsg({type: MsgStatus.UN_SHIFT_LIST, playloads: messageList});
      }
    },
  });

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
    if (childRef) {
      childRef?.current?.changeShow(false);
    }
  };

  const inputCmpRef = useRef<any>(null);

  const fetchPreMsgRecord = () => {
    const pageSum = Math.ceil(msgState.msgList.length / 20);
    if (pageSum < pageIndex) {
      return;
    }
    setMsgReqData({
      Myself: state.userInfo.userID,
      Other: state.CurChatItem.ChatToUserID,
      PageIndex: pageIndex,
      token: state.userInfo.token,
    });
    let nextPageIndex = pageIndex + 1;
    setpageIndex(nextPageIndex);
  };

  // ws接受到实时message
  const receiveMsgAction = useCallback(
    (bePushedObj: bePushedMsgType) => {
      const {Message, UserInfo} = bePushedObj;
      const messageItem: msgType = {
        msgid: Message.MsgID,
        content: Message.content,
        ownerid: UserInfo.UserID,
        otherid: Message.recipient,
        type: Message.type,
        time: Message.time,
        isSender: Message.sender === state.userInfo.userID ? true : false,
        avatarUrl: UserInfo.Avatar,
      };
      dispatchMsg({type: MsgStatus.APPEND_MSG_LIST, playloads: messageItem});
      setTimeout(() => {
        scrollContainer!.current.scrollToEnd({animated: true});
      }, 10);
    },
    [chatID],
  );

  useEffect(() => {
    const listener = eventBus.addListener('pushMsg', receiveMsgAction);
    return () => {
      listener.remove();
    };
  }, [receiveMsgAction]);

  // 模拟react组件销毁
  useEffect(() => {
    setURL(
      `${BASE_URL}${API_PATH.CAN_I_CHAT}?from=${state.userInfo.userID}&to=${state.CurChatItem.ChatToUserID}`,
    );
    // 进页面滚动到底部
    setTimeout(() => {
      scrollContainer!.current.scrollToEnd({animated: false});
    }, 1);
    // 加入chatroom，更改服务端状态
    postData(`${BASE_URL}${API_PATH.JOIN_CHAT}`, {
      token: state.userInfo.token,
    });
    return () => {
      // 离开chatRoom，toggle用户in the chat状态
      postData(`${BASE_URL}${API_PATH.EXIT_CHAT}`, {
        token: state.userInfo.token,
      });
    };
  }, []);

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
          onRefresh={fetchPreMsgRecord}
          refreshing={false}
          extraData={msgState.msgList}
          data={msgState.msgList}
          renderItem={({item}) => (
            <ChatBubble
              {...item}
              closePopup={closePopup}
              cRef={childRef}
              navigation={navigation}
            />
          )}
          initialNumToRender={msgState.msgList.length}
          keyExtractor={msgItem => msgItem.msgid}
          ref={scrollContainer}
          // onContentSizeChange={() => {
          //   // 发消息时滚动到底部
          //   if (!isFirstScroll) {
          //     scrollContainer!.current.scrollToEnd({animated: true});
          //   }
          // }}
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
        canChat={canChat}
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
          canChat={canChat}
        />
      </ModalCMP>
    </View>
  );
};

export default ChatRoom;
