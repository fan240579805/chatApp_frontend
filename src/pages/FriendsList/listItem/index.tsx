/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {itemStyle} from './ItemStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface itemProps {
  showTitle: string;
  avatarUrl: string;
  status?: number;
}

const FriendListItem: React.FC<itemProps> = ({showTitle, avatarUrl,status}) => {
  return (
    <View style={itemStyle.container}>
      <View>
        <Image source={{uri: avatarUrl}} style={itemStyle.imgStyle} />
      </View>
      <View style={itemStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{showTitle}</Text>
      </View>
      <View style={{height: 40, justifyContent: 'center'}}>
        <TouchableOpacity style={itemStyle.acceptBtn}>
          {status && <Text style={{color: '#fff'}}>同意</Text>}
          {!status && <Text style={{color: '#fff'}}>已发送</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendListItem;
