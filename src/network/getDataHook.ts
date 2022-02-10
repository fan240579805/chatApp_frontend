/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState, useReducer} from 'react';
import reduces from '../reducers';
import {fetchStatus} from '../const';
import {API_DATA_TYPE} from '../type/api_types';
import {fetchActionType} from '../type/actions_type';

type dataType = [
  (value: string) => void,
  (value: fetchActionType) => void,
  API_DATA_TYPE,
];

interface optionsType {
  initUrl: string;
  initData: object;
  fetchOptions?: any;
  reqData?: object;
}

// 封装好的请求data hook
export function useGetData(HookOptions: optionsType): dataType {
  const {
    initUrl,
    initData,
    reqData,
    fetchOptions = defaultGetOptions(reqData),
  } = HookOptions;
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
        console.log('get:', resp);
        dispatch({type: fetchStatus.SUCCESS, playload: resp.data});
      } catch (error) {
        dispatch({type: fetchStatus.ERROR});
      }
    };
    fetchData();
  }, []);

  return [setUrl, dispatch, state];
}

const defaultGetOptions: any = params => {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(params),
  };
};
