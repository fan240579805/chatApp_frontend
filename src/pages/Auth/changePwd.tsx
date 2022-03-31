/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import Toast from '../../components/Toast';
import usePostData, {PostdataType} from '../../network/postDataHook';
import {useInputValidate, validateType} from './utils/validtaeHook';
import {successLogin, failedLogin} from './utils/loginCallback';
import {formStyle} from './formStyle';
import {API_PATH, BASE_URL} from '../../const';
import {postData} from '../../network/postData';

interface Props {
  navigation: any;
}

const ChangePwdPage: React.FC<Props> = ({navigation}) => {
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Vcode, setVcode] = useState('');

  const [Password1, setPassword1] = useState('');
  const [Password2, setPassword2] = useState('');

  const [canSubmit, setCanSubmit] = useState(false);

  const checkCanSubmit = () => {
    return [Email, Username, Vcode, Password1, Password2].every(
      str => str !== '',
    );
  };

  useEffect(() => {
    if (checkCanSubmit()) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [Email, Username, Vcode, Password1, Password2]);

  const [submitData, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: `${BASE_URL}${API_PATH.RESET_PWD}`,
      initData: {},
      // successCbFunc: res => successLogin(res),
      // failedCbFunc: () => failedLogin(),
    });
  const [inputValidate, WronText, isWrong]: validateType = useInputValidate();
  const btnPress = () => {
    // 提交必要的信息
    submitData({UserName: Username, EmailCode: Vcode, PassWord: Password1});
  };

  const sendEmailCode = () => {
    postData(`${BASE_URL}${API_PATH.SEND_MAIL_CODE}`, {
      Email,
      UserName: Username,
    });
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
        placeholder="注册邮箱"
        placeholderTextColor="#C9C8C8"
        value={Email}
        onChangeText={text => {
          setEmail(text);
          inputValidate(text, 'email');
        }}
      />
      <View style={formStyle.emailCodeWrap}>
        <TextInput
          style={formStyle.codeInput}
          placeholder="输入6位数验证码"
          keyboardType="numeric"
          placeholderTextColor="#C9C8C8"
          maxLength={6}
          value={Vcode}
          onChangeText={text => {
            const newText = text.replace(/[^\d]+/, '');
            setVcode(newText);
            inputValidate(newText);
          }}
        />
        <TouchableOpacity
          style={formStyle.sendCodeBtn}
          onPress={sendEmailCode}
          disabled={Email === ''}>
          <Text style={{color: '#fff'}}>发送验证码</Text>
        </TouchableOpacity>
      </View>
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
        style={[
          formStyle.subBtn,
          {backgroundColor: canSubmit ? 'rgb(0,170,255)' : 'grey'},
        ]}
        activeOpacity={0.5}
        underlayColor="#2292DD"
        onPress={btnPress}
        disabled={!canSubmit}>
        <Text style={formStyle.btnText}>提交</Text>
      </TouchableHighlight>
      {isFetching && <Toast showContent="加载中" Icon="reload-outline" />}
      {isError && <Toast showContent="用户名或密码错误" Icon="close-outline" />}
    </View>
  );
};

export default ChangePwdPage;
