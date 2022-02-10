/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Toast from '../../components/Toast';
import usePostData, {PostdataType} from '../../network/postDataHook';
import {useInputValidate, validateType} from './utils/validtaeHook';
import {successLogin, failedLogin} from './utils/loginCallback';
import {formStyle} from './formStyle';
import {API_PATH, BASE_URL} from '../../const';

interface Props {
  navigation: any;
}

const ChangePwdPage: React.FC<Props> = ({navigation}) => {
  const [Username, setUsername] = useState('');
  const [Password1, setPassword1] = useState('');
  const [Password2, setPassword2] = useState('');

  const [submitData, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: `${BASE_URL}${API_PATH.REGISTER}`,
      initData: {},
      successCbFunc: res => successLogin(dispatch, res),
      failedCbFunc: () => failedLogin(),
    });
  const [inputValidate, WronText, isWrong]: validateType = useInputValidate();
  const btnPress = () => {
    // 提交用户名密码
    submitData({Username, Password1});
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
        placeholder="输入新密码"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={Password1}
        secureTextEntry={true}
        onChangeText={text => {
          setPassword1(text);
          inputValidate(text);
        }}
      />
      <TextInput
        style={formStyle.input}
        placeholder="再次输入新密码"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={Password2}
        secureTextEntry={true}
        onChangeText={text => {
          setPassword2(text);
          inputValidate(text);
        }}
      />
      {isWrong && (
        <View style={formStyle.WrongTextWrap}>
          <Text style={formStyle.WrongText}>{WronText}</Text>
        </View>
      )}
      <TouchableHighlight
        style={formStyle.subBtn}
        activeOpacity={0.5}
        underlayColor="#2292DD"
        onPress={btnPress}>
        <Text style={formStyle.btnText}>提交</Text>
      </TouchableHighlight>
      {isFetching && <Toast showContent="加载中" Icon="reload-outline" />}
      {isError && <Toast showContent="用户名或密码错误" Icon="close-outline" />}
    </View>
  );
};

export default ChangePwdPage;
