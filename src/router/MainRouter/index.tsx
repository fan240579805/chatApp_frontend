/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {TabRouterPage} from './tabbarPageRouter';
import {AuthRouterPage} from './AuthPageRouter';
import {throughRouterPage} from './throughPageRouter';
import {ctxPassThroughType} from '../../type/state_type';
import {Context} from '../../state/stateContext';
const RootStack = createNativeStackNavigator();

interface mainRouterProps {
  LoginStatus: number;
  setLoginStatus: (value: number) => void;
}

// 路由跳转所开启的新页面
const MainRouter: React.FC<mainRouterProps> = ({LoginStatus}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  return (
    <RootStack.Navigator>
      {LoginStatus === 0 && throughRouterPage(RootStack)}
      {/* {LoginStatus === 1 && AuthRouterPage(RootStack)}
      {TabRouterPage(RootStack, setLoginStatus)} */}
      {state.isLogin ? TabRouterPage(RootStack) : AuthRouterPage(RootStack)}
    </RootStack.Navigator>
  );
};

export default MainRouter;
