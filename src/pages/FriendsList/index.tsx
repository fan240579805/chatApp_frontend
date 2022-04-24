import React, {useContext, useEffect} from 'react';
import {TouchableOpacity, FlatList, View, Text} from 'react-native';
import {stateStatus} from '../../const';
import {Context} from '../../state/stateContext';

import {bePushedFriendType, ctxPassThroughType, friendItemType} from '../../type/state_type';
import eventBus from '../../utils/eventBus';
import {fpageStyle} from './friendPageStyle';
import FriendListItem from './listItem';
interface Props {
  navigation: any;
}

const render = (navigation: any, item: friendItemType, dispatchNewData: any) => {
  const {FriendProfile} = item;
  let friendFlag = true;
  if (item.Status === 2 && !item.IsMaster) {
    friendFlag = false;
  } else if (item.Status === 3 && item.IsMaster) {
    friendFlag = false;
  } else if (item.Status === -1 || item.Status === -2) {
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
            });
          }}>
          <FriendListItem {...FriendProfile} Status={item.Status} dispatchNewData={dispatchNewData} isMaster={item.IsMaster} />
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

  useEffect(() => {
    const listener = eventBus.addListener('pushFriend', (bePushedObj: bePushedFriendType) => {
      const {Friend} = bePushedObj;
      const friendItem: friendItemType = {
        ...Friend,
      };
      dispatch({type: stateStatus.PUSH_FRIEND_ITEM, playloads: friendItem});
    });
    return () => {
      listener.remove();
    };
  }, [state.friendList]);

  return (
    <FlatList
      data={state.friendList}
      renderItem={({item}) => render(navigation, item, dispatch)}
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
