/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useReducer, useEffect} from 'react';
import reduces from '../reducers';
import {fetchStatus} from '../const';
import {API_DATA_TYPE, RESP_TYPE} from '../type/api_types';
import {postData} from './postData';
import {ToastAndroid} from 'react-native';
import {fetchActionType} from '../type/actions_type';

export type PostdataType = [
  (value: any) => void,
  (value: string) => void,
  API_DATA_TYPE,
  (value: fetchActionType) => void,
];

interface optionsType {
  initUrl: string;
  initData: object;
  successCbFunc?: (res: any) => void; // 请求成功需要执行的一些回调函数
  failedCbFunc?: () => void; // 请求失败需要执行的一些回调函数
  initReqData?: any; // 请求参数
  options?: any; // 额外的fetch配置选项
}

// 封装好的请求data hook
export default function usePostData(
  postHookOptions: optionsType,
): PostdataType {
  const {initUrl, initData, successCbFunc, failedCbFunc, initReqData, options} =
    postHookOptions;

  const [reqData, setReqData] = useState(initReqData);
  const [URL, setURL] = useState(initUrl);
  const [state, dispatchData] = useReducer(reduces.fetchReducer, {
    data: initData,
    isFetching: false,
    isError: false,
  });
  useEffect(() => {
    if (reqData) {
      dispatchData({type: fetchStatus.INIT});
      const post = async () => {
        try {
          let res = await postData(URL, reqData, options);
          if (res.ok) {
            const resp: RESP_TYPE = await res.json();
            console.log('post', resp);
            if (resp.code === 200) {
              dispatchData({
                type: fetchStatus.SUCCESS,
                playload: {...resp.data},
              });
              successCbFunc && successCbFunc(resp.data);
            } else {
              dispatchData({type: fetchStatus.ERROR});
            }
            showTips(resp.msg);
          } else {
            // 信息n不存在数据库。模态框展示, 返回的状态码为422
            dispatchData({type: fetchStatus.ERROR});
          }
        } catch (error) {
          // 网络异常catch
          console.log(error);
          if (failedCbFunc) {
            failedCbFunc && failedCbFunc();
          } else {
            showTips('网络异常');
          }
        }
      };
      post();
    }
  }, [reqData]);
  return [setReqData, setURL, state, dispatchData];
}

const showTips = (msg: string) => {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    10,
    100,
  );
};
