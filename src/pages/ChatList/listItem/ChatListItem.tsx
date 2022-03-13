/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image} from 'react-native';
import Popup from '../../../components/popup';
import {listStyle} from './listItemStyle';
import {operateType} from '../../../type/props_type';
import {useState} from 'react';
import {chatListItemType} from '../../../type/state_type';
import {dateFormat, FormatsEnums} from '../../../utils/common/time';

interface itemProps extends chatListItemType {}

const ChatListItem: React.FC<itemProps> = ({
  ChatID,
  RecentMsg,
  ChatToNickName,
  ChatToUserID,
  ChatToUserAvatar,
  RecentTime,
}) => {
  const [isShowPop, setShow] = useState(false);

  const operations: Array<operateType> = [
    {title: '删除聊天', execfunc: () => console.log('del')},
  ];
  return (
    <View style={listStyle.container}>
      <View>
        <Image source={{uri: ChatToUserAvatar}} style={listStyle.imgStyle} />
      </View>
      <View style={listStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{ChatToNickName}</Text>
        <Text style={{fontSize: 14}}>{RecentMsg}</Text>
      </View>
      {/* {isShowPop && <Popup operations={operations} />} */}

      <View style={listStyle.timeWrap}>
        <Text style={{fontSize: 12}}>
          {dateFormat(RecentTime, FormatsEnums._MD)}
        </Text>
      </View>
    </View>
  );
};

export default ChatListItem;
