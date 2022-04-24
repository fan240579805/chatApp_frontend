import {useCallback, useContext, useEffect, useReducer, useState} from 'react';
import {API_PATH, BASE_URL} from '../const';
import usePostData from '../network/postDataHook';
import {ActionType, msgListStateType, msgReducer, MsgStatus} from '../reducers/msgListReducer';
import {Context} from '../state/stateContext';
import {bePushedMsgType, ctxPassThroughType, message, msgType} from '../type/state_type';
import eventBus from '../utils/eventBus';

type returnType = [msgListStateType, React.Dispatch<ActionType>, () => void, boolean];

/**
 * 处理消息逻辑hook
 * @param scrollEnd 聊天页面容器，用于发送消息后滚动
 */
export const useHandleMessage = (scrollEnd: any): returnType => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [pageIndex, setpageIndex] = useState(0);

  const [isFetchRecord, setFetch] = useState(false);

  // 消息列表
  const [msgState, dispatchMsg] = useReducer(msgReducer, {
    msgList: new Array<msgType>(),
  });

  // 获取第1页聊天记录
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
          avatarUrl: isSender ? state.userInfo.avatar : state.CurChatItem.ChatToUserAvatar,
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

  // 翻页拉去聊天记录
  const fetchPreMsgRecord = () => {
    setFetch(true);
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
      scrollEnd();
    },
    [state.CurChatItem.ChatID],
  );

  useEffect(() => {
    const listener = eventBus.addListener('pushMsg', receiveMsgAction);
    // 进页面滚动到底部
    return () => {
      listener.remove();
    };
  }, [receiveMsgAction]);

  return [msgState, dispatchMsg, fetchPreMsgRecord, isFetchRecord];
};
