import React, {useContext} from 'react';
import {TouchableOpacity, Image, View, Text} from 'react-native';
import {ctxPassThroughType, userProfileType} from '../../../type/state_type';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {itemStyle} from '../result/itemStyle';
import {Context} from '../../../state/stateContext';
import usePostData, {PostdataType} from '../../../network/postDataHook';
import {API_PATH, BASE_URL, fetchStatus} from '../../../const';
import {fetchActionType} from '../../../type/actions_type';
interface Props extends userProfileType {
  Status: number;
  isMaster: boolean; // 代表当前用户  在数据库中的好友关系记录 是否是发起者
  dispatchNewData: (value: fetchActionType) => void; // 请求成功后dispatch更新父组件展示的数据
}

const Result: React.FC<Props> = ({
  UserID,
  Username,
  NickName,
  Avatar,
  Status,
  isMaster,
  dispatchNewData,
}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  const [submitData, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: `${BASE_URL}${API_PATH.ADD_FRIEND}`,
      initData: {},
      successCbFunc: res => {
        dispatchNewData({type: fetchStatus.SUCCESS, playload: res});
      },
    });
  const addFriend = () => {
    submitData({
      token: state.userInfo.token,
      Username: Username,
      Fromid: state.userInfo.userID,
      Toid: UserID,
    });
  };
  return (
    <View style={itemStyle.container}>
      <View>
        <Image source={{uri: Avatar}} style={itemStyle.imgStyle} />
      </View>
      <View style={itemStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{NickName}</Text>
        <Text style={{fontSize: 12}}>账号：{Username}</Text>
      </View>
      <View style={{height: 40, justifyContent: 'center'}}>
        <TouchableOpacity
          style={itemStyle.addBtn}
          onPress={() => {
            addFriend();
          }}
          disabled={Status !== 0 && Status !== -2}>
          {Status === -1 && UserID === state.userInfo.userID && (
            <Text style={{color: '#fff'}}>已发送</Text>
          )}
          {Status === -1 && UserID !== state.userInfo.userID && (
            <Text style={{color: '#fff'}}>待处理</Text>
          )}
          {Status === 1 && (
            <Ionicons name="checkmark-outline" size={20} color="#fff" />
          )}
          {Status === 2 && isMaster && (
            // 已删除对方
            <Ionicons name="add" size={20} color="#fff" />
          )}
          {Status === 2 && !isMaster && (
            // 被删除
            <Ionicons name="add" size={20} color="#fff" />
          )}
          {Status === 3 && !isMaster && (
            // 已删除对方
            <Ionicons name="add" size={20} color="#fff" />
          )}
          {Status === 3 && isMaster && (
            // 被删除
            <Ionicons name="add" size={20} color="#fff" />
          )}

          {Status === 4 && isMaster && (
            <Text style={{color: '#fff'}}>已拉黑</Text>
          )}
          {Status === 4 && !isMaster && (
            <Text style={{color: '#fff'}}>被对方拉黑</Text>
          )}

          {Status === 5 && isMaster && (
            <Text style={{color: '#fff'}}>被对方拉黑</Text>
          )}
          {Status === 5 && !isMaster && (
            <Text style={{color: '#fff'}}>已拉黑</Text>
          )}

          {(Status === 0 || Status === -2) && (
            <Ionicons name="add" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Result;
