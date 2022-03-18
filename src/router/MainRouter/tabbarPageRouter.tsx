import React, {useContext} from 'react';
import {getHeaderTitle} from '../../utils/route';

import TabarRouter from '../TabarRouter';
import ChatRoomPage from '../../pages/ChatRoom';
import IconBtn from '../../components/IconBtn';
import ChatInfo from '../../pages/ChatRoom/chatInfo';
import FriendInfo from '../../pages/FriendsList/friendInfo';

export const TabRouterPage: React.FC<any> = RootStack => {
  return (
    <RootStack.Group>
      <RootStack.Screen
        name="TabarRouter"
        component={TabarRouter}
        options={({route}) => ({
          title: getHeaderTitle(route),
          headerTitleAlign: 'center',
        })}
      />
      <RootStack.Screen
        name="ChatRoomPage"
        component={ChatRoomPage}
        options={({navigation, route}) => ({
          title: getHeaderTitle(route),
          headerTitleAlign: 'center',
          headerRight: () => (
            <IconBtn
              iconName="ellipsis-horizontal"
              size={25}
              pressHandle={() => {
                navigation.navigate('ChatInfo', {
                  showTitle: '聊天信息',
                  isChangeTitle: true,
                });
              }}
            />
          ),
        })}
      />
      <RootStack.Screen
        name="ChatInfo"
        component={ChatInfo}
        options={({route}) => ({
          title: getHeaderTitle(route),
          headerTitleAlign: 'center',
        })}
      />
      <RootStack.Screen
        name="FriendInfo"
        component={FriendInfo}
        options={() => ({
          title: '',
          headerShadowVisible: false,
        })}
      />
    </RootStack.Group>
  );
};
