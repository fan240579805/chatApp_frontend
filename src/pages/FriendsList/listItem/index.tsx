/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {itemStyle} from './ItemStyle';
import {ctxPassThroughType, userProfileType} from '../../../type/state_type';
import usePostData, {PostdataType} from '../../../network/postDataHook';
import {API_PATH, BASE_URL, stateStatus} from '../../../const';
import {Context} from '../../../state/stateContext';
import {ctxActionType} from '../../../type/actions_type';
import {formatList} from '../../../utils';

interface itemProps extends userProfileType {
  Status: number;
  isMaster: boolean;
  dispatchNewData: React.Dispatch<ctxActionType>; // 请求成功后dispatch更新全局共享的friendlist展示的数据
}

const FriendListItem: React.FC<itemProps> = ({NickName, Avatar, UserID, Username, Status, isMaster, dispatchNewData}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  const [submitData, setURL]: PostdataType = usePostData({
    initUrl: ``,
    initData: {},
    successCbFunc: res => {
      dispatchNewData({
        type: stateStatus.SET_FRIENDLIST,
        playloads: formatList(res),
      });
    },
    initReqData: {
      token: state.userInfo.token,
      From: UserID,
      To: state.userInfo.userID,
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
        }}
      >
        {/* UserID === state.userInfo.userID 当前展示的好友是自己，即自己需要处理接受/拒绝 */}
        {Status === -1 && !isMaster && (
          <TouchableOpacity style={itemStyle.acceptBtn} onPress={acceptFriend}>
            <Text style={{color: '#fff'}}>接受</Text>
          </TouchableOpacity>
        )}
        {Status === -1 && !isMaster && (
          <TouchableOpacity onPress={rejectFriend} style={[itemStyle.acceptBtn, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff'}}>拒绝</Text>
          </TouchableOpacity>
        )}
        {/* ！== 说明自己不是被添加用户 等待请求通过 */}
        {Status === -1 && isMaster && (
          <View style={itemStyle.acceptBtn}>
            <Text style={{color: '#fff'}}>待接受</Text>
          </View>
        )}
        {Status === -2 && isMaster && (
          <View style={[itemStyle.acceptBtn, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff', fontSize: 12}}>被拒绝</Text>
          </View>
        )}
        {Status === 2 && !isMaster && (
          <View style={[itemStyle.acceptBtn, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff', fontSize: 12}}>您已被删除</Text>
          </View>
        )}
        {Status === 3 && isMaster && (
          <View style={[itemStyle.acceptBtn, {backgroundColor: 'red'}]}>
            <Text style={{color: '#fff', fontSize: 12}}>您已被删除</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendListItem;
