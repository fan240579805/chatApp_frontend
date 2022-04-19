import {ToastAndroid} from 'react-native';
import {stateStatus} from '../../../const';
import {userInfoType} from '../../../type/state_type';
import storage from '../../../utils/storage';
export function successLogin(res: any, dispatch?: any) {
  // 本地存储登录态，userid 等全局关键信息
  for (const resKey in res) {
    storage.save({key: resKey, data: res[resKey]});
  }
  const userInfo: userInfoType = {
    token: res.token,
    userID: res.userID,
    username: res.username,
    avatar: res.avatar,
  };
  const playloads = {isLogin: true, user: userInfo};
  dispatch({type: stateStatus.LOG_IN_AND_SIGN_IN, playloads: playloads});
}

export function failedLogin() {
  ToastAndroid.showWithGravityAndOffset('登录失败，请检查网络', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 10, 100);
}
