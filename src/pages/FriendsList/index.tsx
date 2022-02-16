import React, {useContext} from 'react';
import {TouchableOpacity, FlatList, View} from 'react-native';
import {API_PATH, BASE_URL} from '../../const';
import {useGetData} from '../../network/getDataHook';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType, userProfileType} from '../../type/state_type';

import FriendListItem from './listItem';
interface Props {
  navigation: any;
}
interface friendItemType {
  FriendProfile: userProfileType;
  Status: number;
  AddTime: string;
}
const render = (navigation: any, item: friendItemType) => {
  const {FriendProfile} = item;
  return (
    <>
      {FriendProfile.UserID && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FriendInfo', {
              isChangeTitle: true,
              ...FriendProfile,
              addtime: item.AddTime,
            });
          }}>
          <FriendListItem {...FriendProfile} />
        </TouchableOpacity>
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
  });
  return (
    <FlatList
      data={data}
      renderItem={({item}) => render(navigation, item)}
      keyExtractor={item => item.FriendProfile.UserID}
    />
  );
};

export default FriendList;
