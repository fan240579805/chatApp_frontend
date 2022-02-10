/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useRef, useState} from 'react';
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
import {fileOptions} from '../../network/formData';
import {API_PATH, BASE_URL} from '../../const';
import UploadImageBtn from '../../components/uploadImage';
import {formStyle} from './formStyle';
import {ctxPassThroughType} from '../../type/state_type';
import {Context} from '../../state/stateContext';

interface Props {
  navigation: any;
}

const SignPage: React.FC<Props> = ({navigation}) => {
  const [UserName, setUserName] = useState('');
  const [Email, setEmail] = useState('');
  const [PassWord, setPassWord] = useState('');
  const [NickName, setNickName] = useState('');
  const childRef = useRef(null);
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [submitData, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: `${BASE_URL}${API_PATH.REGISTER}`,
      initData: {},
      successCbFunc: res => successLogin(dispatch, res),
      failedCbFunc: () => failedLogin(),
      options: fileOptions,
    });
  const [inputValidate, WronText, isWrong]: validateType = useInputValidate();
  const btnPress = () => {
    // 提交用户名密码
    submitData({
      UserName,
      PassWord,
      NickName,
      Email,
      file: childRef.current.imgUrl,
      fileName: childRef.current.fileName,
    });
  };
  return (
    <View style={formStyle.signContainer}>
      <UploadImageBtn hasBtn={false} cRef={childRef} />
      <Text style={{marginTop: -13, color: '#999', fontSize: 14}}>
        点击选择头像
      </Text>
      <TextInput
        style={formStyle.input}
        placeholder="账号"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={UserName}
        onChangeText={text => {
          setUserName(text);
          inputValidate(text);
        }}
      />
      <TextInput
        style={formStyle.input}
        placeholder="邮箱"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={Email}
        onChangeText={text => {
          setEmail(text);
          inputValidate(text);
        }}
      />
      <TextInput
        style={formStyle.input}
        placeholder="昵称"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={NickName}
        onChangeText={text => {
          setNickName(text);
          inputValidate(text);
        }}
      />
      <TextInput
        style={formStyle.input}
        placeholder="密码"
        placeholderTextColor="#C9C8C8"
        maxLength={22}
        value={PassWord}
        secureTextEntry={true}
        onChangeText={text => {
          setPassWord(text);
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
        <Text style={formStyle.btnText}>注册</Text>
      </TouchableHighlight>
      <View style={[formStyle.moreInfoWrap, {flexDirection: 'row-reverse'}]}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('LoginPage')}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 13, marginRight: 8}}>已有账号?</Text>
            <Text style={{color: 'rgb(0, 170, 255)', fontSize: 13}}>登录</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      {isFetching && <Toast showContent="加载中" Icon="reload-outline" />}
      {isError && (
        <Toast showContent="注册失败请留意提示" Icon="close-outline" />
      )}
      {/* <Toast showContent="注册失败" Icon="close-outline" /> */}
    </View>
  );
};

export default SignPage;
