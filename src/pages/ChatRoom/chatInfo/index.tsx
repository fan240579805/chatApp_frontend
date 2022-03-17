import React, {useContext, useState} from 'react';
import {Switch, View} from 'react-native';
import LongBtn from '../../../components/longBtn';
import {stateStatus} from '../../../const';
import {Context} from '../../../state/stateContext';
import {ctxPassThroughType} from '../../../type/state_type';
import {infoStyle} from './infoStyle';
interface Props {}

const ChatInfo: React.FC<Props> = () => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [isTop, setTop] = useState(false);
  const [isUnTip, setUnTip] = useState(false);
  const [isBlacked, setBlack] = useState(false);
  const {CurChatItem} = state;

  const toggleTop = () => {
    if (isTop) {
      dispatch({
        type: stateStatus.TOGGLE_TOP_LIST,
        playloads: {operFlag: false, chatItem: CurChatItem},
      });
      // 补充缓存添加chatIDs
    } else {
      dispatch({
        type: stateStatus.TOGGLE_TOP_LIST,
        playloads: {operFlag: true, chatItem: CurChatItem},
      });
      // 补充缓存，从chatIDS中移除相应的chatid

    }
    setTop(!isTop);
  };
  return (
    <View style={infoStyle.container}>
      <View style={infoStyle.userWrap}></View>
      <View style={infoStyle.BtnWrap}>
        <LongBtn showContent="置顶聊天">
          <Switch value={isTop} onChange={toggleTop} />
        </LongBtn>
        <LongBtn showContent="消息免打扰" onPress={() => console.log(123)}>
          <Switch value={isUnTip} onChange={() => setUnTip(!isUnTip)} />
        </LongBtn>
        <LongBtn showContent="拉黑对方" onPress={() => console.log(123)}>
          <Switch value={isBlacked} onChange={() => setBlack(!isBlacked)} />
        </LongBtn>
        <LongBtn
          showContent="删除聊天"
          onPress={() => console.log(123)}
          EndIcon="chevron-forward"
          style={{marginTop: 10}}
        />
        <LongBtn
          showContent="清空聊天记录"
          onPress={() => console.log(123)}
          EndIcon="chevron-forward"
          style={{marginTop: 10}}
        />
      </View>
    </View>
  );
};

export default ChatInfo;
