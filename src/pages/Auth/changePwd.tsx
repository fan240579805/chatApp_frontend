/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableHighlight, View, TextInput, Button, TouchableOpacity} from 'react-native';
import Toast from '../../components/Toast';
import usePostData, {PostdataType, showTips} from '../../network/postDataHook';
import {useInputValidate, validateType} from './utils/validtaeHook';
import {successLogin, failedLogin} from './utils/loginCallback';
import {formStyle} from './formStyle';
import {API_PATH, BASE_URL} from '../../const';
import {postData} from '../../network/postData';
import {useCheckSubmit} from '../../hooks/checkCanSubmit';
import {RESP_TYPE} from '../../type/api_types';

interface Props {
  navigation: any;
}

const ChangePwdPage: React.FC<Props> = ({navigation}) => {
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Vcode, setVcode] = useState('');

  const [Password1, setPassword1] = useState('');
  const [Password2, setPassword2] = useState('');

  const [canSubmit] = useCheckSubmit([Email, Username, Vcode, Password1, Password2]);

  const [hasSendCode, setHasSendCode] = useState(false);
  const [emailTime, setEmailTime] = useState(0);
  const [Intervaler, setIntervaler] = useState(null);

  const [submitData, setURL, {isError, isFetching, data}]: PostdataType = usePostData({
    initUrl: `${BASE_URL}${API_PATH.RESET_PWD}`,
    initData: {},
    successCbFunc: res => clearTimeout(timeRef.current),
    // failedCbFunc: () => failedLogin(),
  });
  const [inputValidate, WronText, isWrong]: validateType = useInputValidate();
  const btnPress = () => {
    // 提交必要的信息
    submitData({UserName: Username, EmailCode: Vcode, PassWord: Password1});
  };

  const timeRef = useRef<any>(); //设置延时器
  //倒计时
  useEffect(() => {
    //如果设置倒计时且倒计时不为0
    if (emailTime && emailTime !== 0)
      timeRef.current = setTimeout(() => {
        setEmailTime(t => t - 1);
      }, 1000);
    //清楚延时器
    return () => {
      clearTimeout(timeRef.current);
    };
  }, [emailTime]);

  const sendEmailCode = async () => {
    try {
      const res = await postData(`${BASE_URL}${API_PATH.SEND_MAIL_CODE}`, {
        Email,
        UserName: Username,
      });
      if (res.ok) {
        const resp: RESP_TYPE = await res.json();
        if (resp.code === 200) {
          setHasSendCode(true);
          setEmailTime(60);
        }
      } else {
        showTips('发送失败，稍后重试');
      }
    } catch (error) {
      showTips('发送失败，服务器出错');
    }
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
          style={[formStyle.sendCodeBtn, {backgroundColor: Email !== '' && !hasSendCode ? 'rgb(0,170,255)' : '#D4DADC'}]}
          onPress={sendEmailCode}
          disabled={Email === '' || hasSendCode}>
          {hasSendCode && <Text style={{color: '#fff'}}>{`已发送,${emailTime}s`}</Text>}
          {!hasSendCode && <Text style={{color: '#fff'}}>发送验证码</Text>}
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
        style={[formStyle.subBtn, {backgroundColor: canSubmit ? 'rgb(0,170,255)' : '#D4DADC'}]}
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
