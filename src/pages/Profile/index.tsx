/* eslint-disable no-shadow */
import React, {useContext, useState} from 'react';
import {TouchableHighlight, View, Text, ToastAndroid} from 'react-native';
import InfoCard from '../../components/InfoCard';
import LongBtn from '../../components/longBtn';
import ModalCMP from '../../components/Modal';
import UploadImageBtn from '../../components/uploadImage';
import {API_PATH, BASE_URL, stateStatus} from '../../const';
import {useGetData} from '../../network/getDataHook';
import {postData} from '../../network/postData';
import {Context} from '../../state/stateContext';
import {RESP_TYPE} from '../../type/api_types';
import {ctxPassThroughType} from '../../type/state_type';
import storage from '../../utils/storage';
import DisplayBar from './displayBar';
import InfoInput from './InfoInput';
import {profileStyle} from './profileStyle';

interface Props {
  navigation: any;
}

const Profile: React.FC<Props> = () => {
  const [modalVisable, setModalVisable] = useState(false);
  const [inputVisable, setInputVisable] = useState(false);
  const [propInputName, setPropInputName] = useState('请输入...');
  const [InputType, setInputType] = useState('');

  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  // data为请求到的数据 dispatchNewData更新数据函数
  const [setURL, dispatchNewData, {isError, isFetching, data}] = useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_USERINFO}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
  });

  // 点击长按钮拉起模态框
  const pressHandle = (isInput: boolean, inputName?: string, inputType?: string) => {
    setModalVisable(!modalVisable);
    setInputVisable(isInput);
    isInput && inputName && setPropInputName(inputName);
    inputType && setInputType(inputType);
  };

  const exitServerLogin = async () => {
    const res = await postData(`${BASE_URL}${API_PATH.LOG_OUT}`, {
      token: state.userInfo.token,
    });
    const resp: RESP_TYPE = await res.json();
    if (resp.code === 200) {
      ToastAndroid.showWithGravityAndOffset('成功登出', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 10, 100);
    } else {
      ToastAndroid.showWithGravityAndOffset('登陆态清除失败', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 10, 100);
    }
  };
  const exitLogin = async () => {
    await exitServerLogin();
    dispatch({type: stateStatus.LOG_OUT, playloads: null});
    // 清除本地缓存所有key
    ['username', 'token', 'userID'].forEach(key => {
      storage.remove({key});
    });
  };

  return (
    <View>
      {data && (
        <InfoCard nickname={data.NickName} userName={data.Username} avatarUrl={data.Avatar}>
          <DisplayBar
            friendNum={state.friendList.filter(fitem => fitem.Status !== -100 && fitem.Status !== -404).length}
            blackListNum={state.otherData?.BlackNum || 0}
            unDisturbNum={state.otherData?.unDisturbNum || 0}
            subNum={state.TopChatList.length}
          />
        </InfoCard>
      )}
      <View style={profileStyle.Bwrap}>
        <View style={profileStyle.BtnContainer}>
          <LongBtn FrontIcon="image-outline" showContent="更换头像" EndIcon="chevron-forward" onPress={() => pressHandle(false)} />
          <LongBtn
            FrontIcon="clipboard-outline"
            showContent="更改昵称"
            EndIcon="chevron-forward"
            onPress={() => pressHandle(true, '请输入新的昵称', 'nickname')}
          />
          <LongBtn
            FrontIcon="mail-outline"
            showContent="更换邮箱"
            EndIcon="chevron-forward"
            onPress={() => pressHandle(true, '请输入新的邮箱', 'email')}
          />
          <LongBtn
            FrontIcon="key-outline"
            showContent="修改密码"
            EndIcon="chevron-forward"
            onPress={() => pressHandle(true, '请输入新的密码', 'password')}
          />
        </View>
      </View>

      <TouchableHighlight style={profileStyle.exitBtn} activeOpacity={0.5} underlayColor="#CDD2D4" onPress={() => exitLogin()}>
        <Text style={profileStyle.btnText}>退出登录</Text>
      </TouchableHighlight>

      <ModalCMP modalVisible={modalVisable} setModalVisible={setModalVisable}>
        {inputVisable ? (
          <InfoInput inputName={propInputName} setModalVisable={setModalVisable} InputType={InputType} dispatchNewData={dispatchNewData} />
        ) : (
          <UploadImageBtn hasBtn={true} cRef={null} dispatchNewData={dispatchNewData} setModalVisable={setModalVisable} />
        )}
      </ModalCMP>
    </View>
  );
};

export default Profile;
