import React, { useContext } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ChatListPage from '../../pages/ChatList';
import FriendsListPage from '../../pages/FriendsList';
import ProfilePage from '../../pages/Profile';
import SearchPage from '../../pages/Search';
import { Context } from '../../state/stateContext';
import { ctxPassThroughType } from '../../type/state_type';

const Tab = createBottomTabNavigator();

// tabbar 选项卡
const TabarRouter: React.FC<any> = () => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'ChatList':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'FriendsList':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              break;
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="ChatList"
        component={ChatListPage}
        options={{tabBarBadge: state?.otherData?.totalUnReadNum || undefined, headerShown: false}}
      />
      <Tab.Screen
        name="FriendsList"
        component={FriendsListPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default TabarRouter;
