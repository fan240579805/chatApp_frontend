import React, {useContext, useState} from 'react';
import {View, TextInput, Button, ToastAndroid} from 'react-native';
import {API_PATH, BASE_URL, fetchStatus} from '../../../const';
import usePostData, {PostdataType} from '../../../network/postDataHook';
import {Context} from '../../../state/stateContext';
import {fetchActionType} from '../../../type/actions_type';
import {ctxPassThroughType} from '../../../type/state_type';
import {inputStyle} from './inputStyle';

import Toast from '../../../components/Toast';

interface Props {
  inputName: string;
  InputType: string;
  dispatchNewData: (value: fetchActionType) => void;// 请求成功后dispatch更新父组件展示的数据
  setModalVisable: (value: boolean) => void;
}

const InfoInput: React.FC<Props> = ({
  inputName,
  setModalVisable,
  dispatchNewData,
  InputType,
}) => {
  const [inputValue, setInputValue] = useState('');
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  // 提交成功回调函数
  const successCbFunc = (res: any) => {
    // 更新数据成功后将新数据 dispatch分发给父组件以便页面同步新改的数据
    dispatchNewData({type: fetchStatus.SUCCESS, playload: res});
    setModalVisable(false);
  };
  const [submitData, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: `${BASE_URL}${API_PATH.UPDATE_USERINFO}`,
      initData: {},
      successCbFunc,
    });

  // 提交事件
  const submitHandle = () => {
    submitData({
      token: state.userInfo.token,
      InfoAttr: InputType,
      Playloads: inputValue,
    });
  };
  return (
    <View>
      <TextInput
        placeholder={inputName}
        value={inputValue}
        onChangeText={text => setInputValue(text)}
        style={inputStyle.textInput}
      />
      <View style={{width: '100%', flexDirection: 'row-reverse'}}>
        <View style={inputStyle.subBtn}>
          <Button title="提交" onPress={submitHandle} />
        </View>
      </View>
      {isError && <Toast showContent="修改失败" Icon="close-outline" />}
    </View>
  );
};

export default InfoInput;
