/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, View, Image, Switch, TouchableOpacity} from 'react-native';
import {InfoStyle} from './InfoStyle';
import LongBtn from '../../../components/longBtn';

interface infoProps {
  route: any;
  navigation: any;
}

const FriendInofo: React.FC<infoProps> = ({route, navigation}) => {
  // 接收路由跳转携带过来的user数据
  // 后续补上添加日期,userid
  const {UserID, Username, Avatar, Email, NickName, addtime} = route.params;

  const [isBlacked, setBlack] = useState(false);

  return (
    <View style={InfoStyle.container}>
      <View style={InfoStyle.userWrap}>
        <Image source={{uri: Avatar}} style={InfoStyle.ImgStyle} />
        <View style={InfoStyle.TextWrap}>
          <Text style={InfoStyle.nameText}>{NickName}</Text>
          <Text style={InfoStyle.otherText}>账号:{Username}</Text>
          <Text style={InfoStyle.otherText}>添加日期:{addtime}</Text>
          <Text style={InfoStyle.otherText}>邮箱:{Email}</Text>
        </View>
      </View>
      <LongBtn
        showContent="加入黑名单"
        onPress={() => console.log(123)}
        style={{marginTop: 10, matginBottom: 10}}>
        <Switch value={isBlacked} onChange={() => setBlack(!isBlacked)} />
      </LongBtn>
      <View style={InfoStyle.BtnWrap}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatRoomPage', {
              showTitle: NickName,
              isChangeTitle: true,
            });
          }}>
          <Text style={InfoStyle.msgBtn}>发消息</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={InfoStyle.delBtn}>删除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendInofo;
