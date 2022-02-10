/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image} from 'react-native';
import Popup from '../../../components/popup';
import {listStyle} from './listItemStyle';
import {operateType} from '../../../type/props_type';
import {useState} from 'react';

interface itemProps {
  chatName: string;
  chatTime: string;
  avatarUrl: string;
  showContent?: string;
}

const ChatListItem: React.FC<itemProps> = ({
  chatName,
  chatTime,
  avatarUrl,
  showContent,
}) => {
  const [isShowPop, setShow] = useState(false);

  const operations: Array<operateType> = [
    {title: '删除聊天', execfunc: () => console.log('del')},
  ];
  return (
    <View style={listStyle.container}>
      <View>
        <Image source={{uri: avatarUrl}} style={listStyle.imgStyle} />
      </View>
      <View style={listStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{chatName}</Text>
        <Text style={{fontSize: 14}}>{showContent}</Text>
      </View>
      {/* {isShowPop && <Popup operations={operations} />} */}

      <View style={listStyle.timeWrap}>
        <Text style={{fontSize: 12}}>{chatTime}</Text>
      </View>
    </View>
  );
};

export default ChatListItem;
