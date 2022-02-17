import React, {useContext, useEffect, useState} from 'react';
import {TouchableOpacity, FlatList, View, Text} from 'react-native';
import {API_PATH, BASE_URL, fetchStatus} from '../../const';
import {useGetData} from '../../network/getDataHook';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType, userProfileType} from '../../type/state_type';

import FriendListItem from './listItem';
interface Props {
  navigation: any;
}
interface friendItemType {
  FriendProfile: userProfileType | null;
  Status: number;
  AddTime: string;
}
const render = (
  navigation: any,
  item: friendItemType,
  dispatchNewData: any,
) => {
  const {FriendProfile} = item;
  return (
    <>
      {item.Status === -100 && <Text>好友请求</Text>}
      {FriendProfile && FriendProfile.UserID && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FriendInfo', {
              isChangeTitle: true,
              ...FriendProfile,
              addtime: item.AddTime,
            });
          }}>
          <FriendListItem
            {...FriendProfile}
            Status={item.Status}
            dispatchNewData={dispatchNewData}
          />
        </TouchableOpacity>
      )}
      {item.Status === -404 && <Text>好友列表</Text>}
    </>
  );
};

const FriendList: React.FC<Props> = ({navigation}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  const [friendList, setfriendList] = useState(new Array<friendItemType>());
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

  // 将请求到的好友列表处理一下
  const formatList = (datalist: Array<friendItemType>): Array<any> => {
    // willexecFriendlist 待处理的好友请求列表
    let willexecFriendlist = datalist.filter(friend => {
      return friend.Status === -1;
    });
    willexecFriendlist.length > 0 &&
      willexecFriendlist.unshift({
        FriendProfile: null,
        AddTime: '',
        Status: -100,
      });
    // hasFriendlist 已经成为好友的好友列表
    let hasFriendlist = datalist.filter(friend => {
      return friend.Status !== -1;
    });
    // 分隔待处理列表和好友列表的分界标志
    hasFriendlist.length > 0 &&
      hasFriendlist.unshift({
        FriendProfile: null,
        AddTime: '',
        Status: -404,
      });
    return [...willexecFriendlist, ...hasFriendlist];
  };

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
