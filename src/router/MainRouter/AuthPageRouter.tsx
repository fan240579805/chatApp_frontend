import React from 'react';

import IconBtn from '../../components/IconBtn';
import LoginPage from '../../pages/Auth/login';
import SignPage from '../../pages/Auth/sign';
import ChangePwdPage from '../../pages/Auth/changePwd';

export const AuthRouterPage: React.FC<any> = RootStack => {
  return (
    <RootStack.Group>
      <RootStack.Screen
        name="LoginPage"
        component={LoginPage}
        options={({navigation}) => ({
          title: '登录',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: navigation.canGoBack()
            ? () => (
                <IconBtn
                  iconName="chevron-back-outline"
                  color="rgb(0, 170, 255)"
                  size={25}
                  pressHandle={() => {
                    navigation.goBack();
                  }}
                />
              )
            : null,
        })}
      />
      <RootStack.Screen
        name="SignPage"
        component={SignPage}
        options={({navigation}) => ({
          title: '注册',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <IconBtn
              iconName="chevron-back-outline"
              color="rgb(0, 170, 255)"
              size={25}
              pressHandle={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
      <RootStack.Screen
        name="ChangePwdPage"
        component={ChangePwdPage}
        options={({navigation}) => ({
          title: '忘记密码',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerLeft: () => (
            <IconBtn
              iconName="chevron-back-outline"
              color="rgb(0, 170, 255)"
              size={25}
              pressHandle={() => {
                navigation.goBack();
              }}
            />
          ),
        })}
      />
    </RootStack.Group>
  );
};
