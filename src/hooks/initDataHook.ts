import {useEffect, useState} from 'react';
import {getValueFromStorage} from '../utils/storage';
import {validateToken} from '../network/authToken';
import {useCtxHook} from '../state/stateContext';
import {API_PATH, BASE_URL, stateStatus} from '../const';
import {ctxPassThroughType} from '../type/state_type';
import { useGetData } from '../network/getDataHook';
import { formatList } from '../utils';

type loginStatusType = [
  number,
  (value: number) => void,
  any,
  React.Context<ctxPassThroughType>,
];

export default function useInitData(): loginStatusType {
  /**
   * 用于给用户打开app时初始化拉取friendList,chatList等全局共享列表
   */
  // 全局上下文共享state树
  const [Context, dispatch, newState] = useCtxHook();
  const passCTX = {
    dispatch: dispatch,
    state: {...newState},
  };
  const [LoginStatus, setLoginStatus] = useState(0);
  const [setURL, dispatchNewData] = useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_FRIENDLIST}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${newState.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      // 请求成功处理一下data
      // 更新数据成功后将新数据 dispatch分发给父组件以便页面同步新改的数据
      dispatch({type: stateStatus.SET_FRIENDLIST, playloads: formatList(res)});
    },
  });
  useEffect(() => {
    const asyncFetchList = async () => {

    };
    // 异步检查本地存储中的token是否还存在，不存在则自动跳转登录
    asyncFetchList();
  }, []);
  // 执行获取登录态操作
  return [LoginStatus, setLoginStatus, passCTX, Context];
}
