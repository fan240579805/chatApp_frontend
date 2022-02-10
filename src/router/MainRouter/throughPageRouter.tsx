import React from 'react';
import {View} from 'react-native';

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
