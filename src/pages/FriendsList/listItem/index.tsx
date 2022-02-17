/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {itemStyle} from './ItemStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ctxPassThroughType, userProfileType} from '../../../type/state_type';
import usePostData, {PostdataType} from '../../../network/postDataHook';
import {API_PATH, BASE_URL, fetchStatus} from '../../../const';
import {Context} from '../../../state/stateContext';
import {fetchActionType} from '../../../type/actions_type';

interface itemProps extends userProfileType {
  Status: number;
  dispatchNewData: (value: fetchActionType) => void; // 请求成功后dispatch更新父组件展示的数据
}

const FriendListItem: React.FC<itemProps> = ({
  NickName,
  Avatar,
  UserID,
  Username,
  Status,
  dispatchNewData,
}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  const [submitData, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: ``,
      initData: {},
      successCbFunc: res => {
        dispatchNewData({type: fetchStatus.SUCCESS, playload: res});
      },
      initReqData: {
        token: state.userInfo.token,
        From: state.userInfo.userID,
        To: UserID,
      },
    });
  const acceptFriend = () => {
    setURL(`${BASE_URL}${API_PATH.ACCEPT_FRIEND}`);
  };
  const rejectFriend = () => {
    setURL(`${BASE_URL}${API_PATH.REJECT_FRIEND}`);
  };
  return (
    <View style={itemStyle.container}>
      <View>
        <Image source={{uri: Avatar}} style={itemStyle.imgStyle} />
      </View>
      <View style={itemStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{NickName}</Text>
      </View>
      <View
        style={{
          height: 40,
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {/* UserID === state.userInfo.userID 当前展示的好友是自己，即自己需要处理接受/拒绝 */}
        {Status === -1 && UserID === state.userInfo.userID && (
          <TouchableOpacity style={itemStyle.acceptBtn} onPress={acceptFriend}>
            <Text style={{color: '#fff'}}>接受</Text>
          </TouchableOpacity>
        )}
        {Status === -1 && UserID === state.userInfo.userID && (
          <TouchableOpacity
            onPress={rejectFriend}
            style={[itemStyle.acceptBtn, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff'}}>拒绝</Text>
          </TouchableOpacity>
        )}
        {/* ！== 说明自己不是被添加用户 等待请求通过 */}
        {Status === -1 && UserID !== state.userInfo.userID && (
          <View
            style={itemStyle.acceptBtn}>
            <Text style={{color: '#fff'}}>待接受</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendListItem;
