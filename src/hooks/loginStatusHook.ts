import {useEffect, useState} from 'react';
import {getValueFromStorage} from '../utils/storage';
import {validateToken} from '../network/authToken';
import {useCtxHook} from '../state/stateContext';
import {stateStatus} from '../const';
import {ctxPassThroughType} from '../type/state_type';
import {getActionFromState} from '@react-navigation/native';
type loginStatusType = [
  number,
  (value: number) => void,
  any,
  React.Context<ctxPassThroughType>,
];

export default function useLoginStatus(): loginStatusType {
  /**
   * LoginStatus & flag
   * 0 代表重启app的过渡白屏页面
   * 1 登录页
   * 2 主页
   */
  // 全局上下文共享state树
  const [Context, dispatch, newState] = useCtxHook();
  const passCTX = {
    dispatch: dispatch,
    state: {...newState},
    // state: newState,
  };
  const [LoginStatus, setLoginStatus] = useState(0);
  useEffect(() => {
    const asyncCheckStatus = async () => {
      const tokenStr = await getValueFromStorage('token');
      let flag = 0;
      let data;
      if (tokenStr) {
        try {
          // 本地存在token时 向服务器验证token是否合法
          [flag, data] = await validateToken(tokenStr);
          flag === 2 &&
            dispatch({
              type: stateStatus.LOG_IN_AND_SIGN_IN,
              playloads: {
                isLogin: true,
                user: {
                  token: tokenStr,
                  username: data.Username,
                  userID: data.UserID,
                },
              },
            });
          // token不合法或者过期了
          flag === 1 &&
            dispatch({
              type: stateStatus.LOG_OUT,
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        // 本地不存在token，跳转登录页
        flag = 1;
        console.log('no token');
        dispatch({
          type: stateStatus.LOG_OUT,
        });
      }
      setLoginStatus(flag);
    };
    // 异步检查本地存储中的token是否还存在，不存在则自动跳转登录
    asyncCheckStatus();
  }, []);
  // 执行获取登录态操作
  return [LoginStatus, setLoginStatus, passCTX, Context];
}
