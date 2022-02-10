import React from 'react';
import {View, Text, Image} from 'react-native';
import {cardStyle} from './cardStyle';

interface Props {
  nickname: string;
  avatarUrl: string;
  userName: string;
}
// 路由跳转所开启的新页面
const IconBtn: React.FC<Props> = ({
  nickname,
  avatarUrl,
  userName,
  children,
}) => {
  return (
    <View style={cardStyle.container}>
      <View style={cardStyle.FlexContainer}>
        <View>
          <Image source={{uri: avatarUrl}} style={cardStyle.imgStyle} />
        </View>
        <View style={cardStyle.contentWrap}>
          <Text style={{marginBottom: 5, fontSize: 20, color: '#000'}}>
            {nickname}
          </Text>
          <Text style={cardStyle.textArea}>账号：{userName}</Text>
        </View>
      </View>
      <View>{children || null}</View>
    </View>
  );
};

export default IconBtn;
