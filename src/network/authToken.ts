import {ToastAndroid} from 'react-native';
import {BASE_URL, API_PATH} from '../const';

export const validateToken = async (token: string): Promise<[number, any]> => {
  let tip;
  let res;
  try {
    const resp = await fetch(`${BASE_URL}${API_PATH.AUTH_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    res = await resp.json();
    tip = res.msg;
    if (res.code !== 200) {
      ToastAndroid.showWithGravityAndOffset(
        tip,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        10,
        100,
      );
    }
    return [res.code === 200 ? 2 : 1, res.data];
  } catch (error) {
    console.log('token验证失败，请重新登录', error);
    ToastAndroid.showWithGravityAndOffset(
      '网络连接失败，请重试',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      10,
      100,
    );
    return [1, {msg: '登陆失败'}];
  }
};
