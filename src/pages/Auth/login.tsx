/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, TouchableHighlight, View, TextInput, TouchableWithoutFeedback} from 'react-native';
import Toast from '../../components/Toast';
import usePostData, {PostdataType} from '../../network/postDataHook';
import {useInputValidate, validateType} from './utils/validtaeHook';
import {successLogin, failedLogin} from './utils/loginCallback';
import {formStyle} from './formStyle';
import {API_PATH, BASE_URL, stateStatus} from '../../const';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType} from '../../type/state_type';
import {useCheckSubmit} from '../../hooks/checkCanSubmit';

interface Props {
  navigation: any;
}

const LoginPage: React.FC<Props> = ({navigation}) => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [inputValidate, WronText, isWrong]: validateType = useInputValidate();
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [canSubmit] = useCheckSubmit([Username, Password]);

  const [submitData, setURL, {isError, isFetching, data}]: PostdataType = usePostData({
    initUrl: `${BASE_URL}${API_PATH.LOGIN}`,
    initData: {},
    successCbFunc: res => successLogin(res, dispatch),
    failedCbFunc: () => failedLogin(),
  });

  const btnPress = () => {
    // 提交用户名密码
    submitData({Username, Password});
  };
  return (
    <View style={formStyle.container}>
      <TextInput
        style={formStyle.input}
        placeholder="账号"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={Username}
        onChangeText={text => {
          setUsername(text);
          inputValidate(text);
        }}
      />
      <TextInput
        style={formStyle.input}
        placeholder="密码"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={Password}
        secureTextEntry={true}
        onChangeText={text => {
          setPassword(text);
          inputValidate(text);
        }}
      />
      {isWrong && (
        <View style={formStyle.WrongTextWrap}>
          <Text style={formStyle.WrongText}>{WronText}</Text>
        </View>
      )}
      <TouchableHighlight
        style={[formStyle.subBtn, {backgroundColor: canSubmit ? 'rgb(0,170,255)' : '#D4DADC'}]}
        disabled={!canSubmit}
        activeOpacity={0.5}
        underlayColor="#2292DD"
        onPress={btnPress}>
        <Text style={formStyle.btnText}>登录</Text>
      </TouchableHighlight>
      <View style={formStyle.moreInfoWrap}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('ChangePwdPage')}>
          <Text style={{fontSize: 13}}>忘记密码</Text>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => navigation.navigate('SignPage')}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 13, marginRight: 8}}>没有账号?</Text>
            <Text style={{color: 'rgb(0, 170, 255)', fontSize: 13}}>注册</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {isFetching && <Toast showContent="加载中" Icon="reload-outline" />}
      {isError && <Toast showContent="用户名或密码错误" Icon="close-outline" />}
    </View>
  );
};

export default LoginPage;
