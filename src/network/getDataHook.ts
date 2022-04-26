/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState, useReducer} from 'react';
import reduces from '../reducers';
import {fetchStatus} from '../const';
import {API_DATA_TYPE} from '../type/api_types';
import {fetchActionType} from '../type/actions_type';

type dataType = [(value: string) => void, (value: fetchActionType) => void, API_DATA_TYPE];

interface optionsType {
  initUrl: string;
  initData: object;
  fetchOptions?: any;
  reqData?: object;
  successCbFunc?: (res: any) => void; // 请求成功需要执行的一些回调函数
  failedCbFunc?: () => void; // 请求失败需要执行的一些回调函数
}

// 封装好的请求data hook
export function useGetData(HookOptions: optionsType): dataType {
  const {initUrl, initData, reqData, fetchOptions = defaultGetOptions(reqData), successCbFunc, failedCbFunc} = HookOptions;
  const [url, setUrl] = useState(initUrl);
  const [state, dispatch] = useReducer(reduces.fetchReducer, {
    data: initData,
    isFetching: false,
    isError: false,
  });
  useEffect(() => {
    dispatch({type: fetchStatus.INIT});
    const fetchData = async () => {
      try {
        let res = null;
        res = await fetch(url, fetchOptions);
        const resp = await res.json();
        dispatch({type: fetchStatus.SUCCESS, playload: resp.data});
        successCbFunc && successCbFunc(resp.data);
      } catch (error) {
        dispatch({type: fetchStatus.ERROR});
        failedCbFunc && failedCbFunc();
      }
    };
    fetchData();
  }, []);

  return [setUrl, dispatch, state];
}

const defaultGetOptions: any = (params: any) => {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  };
};
