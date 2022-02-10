import React from 'react';
import {View, Text} from 'react-native';
import {barStyle} from './barStyle';

interface Props {
  friendNum: number;
  blackListNum: number;
  unDisturbNum: number;
  subNum: number;
}
// 路由跳转所开启的新页面
const displayBar: React.FC<Props> = ({
  friendNum,
  blackListNum,
  unDisturbNum,
  subNum,
}) => {
  return (
    <View style={barStyle.container}>
      <View style={barStyle.baseItem}>
        <Text style={barStyle.baseNum}>{friendNum}</Text>
        <Text style={barStyle.baseTitle}>好友</Text>
      </View>
      <View style={[barStyle.baseItem, barStyle.blackListItem]}>
        <Text style={barStyle.baseNum}>{blackListNum}</Text>
        <Text style={barStyle.baseTitle}>黑名单</Text>
      </View>
      <View style={[barStyle.baseItem, barStyle.unDistrubItem]}>
        <Text style={barStyle.baseNum}>{unDisturbNum}</Text>
        <Text style={barStyle.baseTitle}>勿扰</Text>
      </View>
      <View style={barStyle.baseItem}>
        <Text style={barStyle.baseNum}>{subNum}</Text>
        <Text style={barStyle.baseTitle}>特别关心</Text>
      </View>
    </View>
  );
};

export default displayBar;
