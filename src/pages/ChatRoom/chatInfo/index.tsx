import React, {useState} from 'react';
import {Switch, View} from 'react-native';
import LongBtn from '../../../components/longBtn';
import {infoStyle} from './infoStyle';
interface Props {}

const ChatInfo: React.FC<Props> = () => {
  const [isTop, setTop] = useState(false);
  const [isUnTip, setUnTip] = useState(false);
  const [isBlacked, setBlack] = useState(false);

  return (
    <View style={infoStyle.container}>
      <View style={infoStyle.userWrap}></View>
      <View style={infoStyle.BtnWrap}>
        <LongBtn showContent="置顶聊天" onPress={() => console.log(123)}>
          <Switch value={isTop} onChange={() => setTop(!isTop)} />
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
