import React from 'react';
import {View} from 'react-native';

// 未来可加个图片作为app开屏页面
const NullPage: React.FC<any> = () => {
  return <View style={{backgroundColor: '#fff', height: '100%'}} />;
};
export const throughRouterPage: React.FC<any> = RootStack => {
  return (
    <RootStack.Group>
      <RootStack.Screen
        name="nullPage"
        options={() => ({
          title: '',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        })}
        component={NullPage}
      />
    </RootStack.Group>
  );
};
