import React, {useContext, useState} from 'react';
import {Switch, View} from 'react-native';
import LongBtn from '../../../components/longBtn';
import {API_PATH, BASE_URL, stateStatus} from '../../../const';
import useTopFromStorage from '../../../hooks/topStorageHook';
import useToggleDisturb from '../../../hooks/useDisturb';
import {useGetData} from '../../../network/getDataHook';
import usePostData, {PostdataType} from '../../../network/postDataHook';
import {Context} from '../../../state/stateContext';
import {ctxPassThroughType} from '../../../type/state_type';
import {throttle} from '../../../utils';
import {infoStyle} from './infoStyle';
interface Props {
  navigation: any;
}

const ChatInfo: React.FC<Props> = ({navigation}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const {CurChatItem} = state;

  const [isTop, setTop, removeChatId, appendToChatIds] = useTopFromStorage(CurChatItem);
  const [isDisturb, setDisturbStatus, CancelUnDisturb, appendToDisturb] = useToggleDisturb(CurChatItem);

  // const [isUnTip, setUnTip] = useState(false);

  const [isBlacked, setBlack] = useState(false);

  const [submitData, setBlackURL]: PostdataType = usePostData({
    initUrl: ``,
    initData: {},
    successCbFunc: res => {
      setBlack(!isBlacked);
      isBlacked && dispatch({type: stateStatus.SET_BLACK_NUM, playloads: -1});
      !isBlacked && dispatch({type: stateStatus.SET_BLACK_NUM, playloads: 1});
    },
    initReqData: {
      token: state.userInfo.token,
      From: state.userInfo.userID,
      To: CurChatItem.ChatToUserID,
    },
  });

  // 获取拉黑态
  useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_BLACK_STATUS}?from=${state.userInfo.userID}&to=${CurChatItem.ChatToUserID}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      setBlack(res.isblack);
    },
  });

  const toggleTop = () => {
    if (isTop) {
      dispatch({
        type: stateStatus.TOGGLE_TOP_LIST,
        playloads: {operFlag: false, chatItem: CurChatItem},
      });
      removeChatId();
      setTop(false);
    } else {
      dispatch({
        type: stateStatus.TOGGLE_TOP_LIST,
        playloads: {operFlag: true, chatItem: CurChatItem},
      });
      appendToChatIds();
      setTop(true);
    }
  };

  const toggleDisturbStatus = async () => {
    let _dMap;
    if (isDisturb) {
      setDisturbStatus(false);
      _dMap = await CancelUnDisturb();
      dispatch({
        type: stateStatus.REMOVE_DISTURB_STATUS,
        playloads: _dMap,
      });
    } else {
      setDisturbStatus(true);
      _dMap = await appendToDisturb();
      dispatch({
        type: stateStatus.APPEND_DISTURB_STATUS,
        playloads: _dMap,
      });
    }
  };

  const toggleBlack = throttle(() => {
    isBlacked && setBlackURL(`${BASE_URL}${API_PATH.CANCEL_BLACK}`);
    !isBlacked && setBlackURL(`${BASE_URL}${API_PATH.TAKE_BLACK}`);
  }, 300);

  const removeCurChat = () => {
    dispatch({type: stateStatus.REMOVE_CUR_CHAT, playloads: CurChatItem});
    navigation.navigate('ChatList');
  };

  return (
    <View style={infoStyle.container}>
      <View style={infoStyle.userWrap}></View>
      <View style={infoStyle.BtnWrap}>
        <LongBtn showContent="置顶聊天" onPress={toggleTop}>
          <Switch value={isTop} disabled={true} />
        </LongBtn>
        <LongBtn showContent="消息免打扰" onPress={toggleDisturbStatus}>
          <Switch value={isDisturb} disabled={true} />
        </LongBtn>
        <LongBtn showContent="拉黑对方" onPress={toggleBlack}>
          <Switch value={isBlacked} disabled={true} />
        </LongBtn>
        <LongBtn showContent="删除聊天" onPress={removeCurChat} EndIcon="chevron-forward" style={{marginTop: 10}} />
        <LongBtn showContent="清空聊天记录" onPress={() => console.log(123)} EndIcon="chevron-forward" style={{marginTop: 10}} />
      </View>
    </View>
  );
};

export default ChatInfo;
