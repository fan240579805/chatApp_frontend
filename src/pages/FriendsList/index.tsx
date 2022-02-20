import React, {useContext} from 'react';
import {TouchableOpacity, FlatList, View, Text} from 'react-native';
import {API_PATH, BASE_URL, fetchStatus} from '../../const';
import {useGetData} from '../../network/getDataHook';
import {Context} from '../../state/stateContext';
import {
  ctxPassThroughType,
  friendItemType,
  userProfileType,
} from '../../type/state_type';
import {formatList} from '../../utils';
import {fpageStyle} from './friendPageStyle';
import FriendListItem from './listItem';
interface Props {
  navigation: any;
}

const render = (
  navigation: any,
  item: friendItemType,
  dispatchNewData: any,
) => {
  const {FriendProfile} = item;
  let friendFlag = true;
  if (item.Status === 2 && !item.IsMaster) {
    friendFlag = false;
  } else if (item.Status === 3 && item.IsMaster) {
    friendFlag = false;
  } else if (item.Status === -1) {
    friendFlag = false;
  }
  return (
    <>
      {item.Status === -100 && (
        <View style={fpageStyle.textWrap}>
          <Text>待处理请求</Text>
        </View>
      )}
      {FriendProfile && FriendProfile.UserID && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FriendInfo', {
              isChangeTitle: true,
              ...FriendProfile,
              addtime: item.AddTime,
              friendFlag,
              firendStatus: item.Status,
              dispatchFriendList: dispatchNewData,
            });
          }}>
          <FriendListItem
            {...FriendProfile}
            Status={item.Status}
            dispatchNewData={dispatchNewData}
            isMaster={item.IsMaster}
          />
        </TouchableOpacity>
      )}
      {item.Status === -404 && (
        <View style={fpageStyle.textWrap}>
          <Text>好友列表</Text>
        </View>
      )}
    </>
  );
};

const FriendList: React.FC<Props> = ({navigation}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  // data为请求到的数据 dispatchNewData更新数据函数
  const [setURL, dispatchNewData, {isError, isFetching, data}] = useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_FRIENDLIST}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      // 请求成功处理一下data
      // 更新数据成功后将新数据 dispatch分发给父组件以便页面同步新改的数据
      dispatchNewData({type: fetchStatus.SUCCESS, playload: formatList(res)});
    },
  });

  return (
    <FlatList
      data={data}
      renderItem={({item}) => render(navigation, item, dispatchNewData)}
      keyExtractor={item => {
        const {FriendProfile} = item;
        if (FriendProfile) {
          return FriendProfile.UserID;
        } else {
          return String(item.Status);
        }
      }}
    />
  );
};

export default FriendList;
