/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {itemStyle} from './ItemStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {userProfileType} from '../../../type/state_type';

interface itemProps extends userProfileType {}

const FriendListItem: React.FC<itemProps> = ({
  NickName,
  Avatar,
  UserID,
  Username,
}) => {
  return (
    <View style={itemStyle.container}>
      <View>
        <Image source={{uri: Avatar}} style={itemStyle.imgStyle} />
      </View>
      <View style={itemStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{NickName}</Text>
      </View>
      <View style={{height: 40, justifyContent: 'center'}}>
        <TouchableOpacity style={itemStyle.acceptBtn}>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendListItem;
