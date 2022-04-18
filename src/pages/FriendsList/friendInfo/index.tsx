/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View, Image, Switch, TouchableOpacity} from 'react-native';
import {InfoStyle} from './InfoStyle';
import LongBtn from '../../../components/longBtn';
import usePostData, {PostdataType} from '../../../network/postDataHook';
import {API_PATH, BASE_URL, stateStatus} from '../../../const';
import {formatList, throttle} from '../../../utils';
import {ctxPassThroughType} from '../../../type/state_type';
import {Context} from '../../../state/stateContext';
import {useGetData} from '../../../network/getDataHook';
import {postData} from '../../../network/postData';
import {RESP_TYPE} from '../../../type/api_types';
import {dateFormat, FormatsEnums} from '../../../utils/common/time';

interface infoProps {
  route: any;
  navigation: any;
}

const FriendInofo: React.FC<infoProps> = ({route, navigation}) => {
  // 接收路由跳转携带过来的user数据
  const {
    UserID,
    Username,
    Avatar,
    Email,
    NickName,
    addtime,
    friendFlag,
    firendStatus,
  } = route.params;

  const [isBlacked, setBlack] = useState(false);
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const initReqData = {
    token: state.userInfo.token,
    From: state.userInfo.userID,
    To: UserID,
  };

  const [submitData, setBlackURL]: PostdataType = usePostData({
    initUrl: ``,
    initData: {},
    successCbFunc: res => {
      dispatch({
        type: stateStatus.SET_FRIENDLIST,
        playloads: formatList(res),
      });
      setBlack(!isBlacked);
      isBlacked && dispatch({type: stateStatus.SET_BLACK_NUM, playloads: -1});
      !isBlacked && dispatch({type: stateStatus.SET_BLACK_NUM, playloads: 1});
    },
    initReqData,
  });
  const [delData, setDelURL]: PostdataType = usePostData({
    initUrl: ``,
    initData: {},
    successCbFunc: res => {
      dispatch({
        type: stateStatus.SET_FRIENDLIST,
        playloads: formatList(res),
      });
      navigation.navigate('FriendsList');
    },
    initReqData,
  });
  // 获取拉黑态
  useGetData({
    initUrl: `${BASE_URL}${API_PATH.GET_BLACK_STATUS}?from=${state.userInfo.userID}&to=${UserID}`,
    initData: {},
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${state.userInfo.token}`,
      },
    },
    successCbFunc: res => {
      setBlack(res.isblack);
    },
  });

  const toggleBlacked = throttle(() => {
    isBlacked && setBlackURL(`${BASE_URL}${API_PATH.CANCEL_BLACK}`);
    !isBlacked && setBlackURL(`${BASE_URL}${API_PATH.TAKE_BLACK}`);
  }, 300);

  const delFriend = () => {
    setDelURL(`${BASE_URL}${API_PATH.DELETE_FRIEND}`);
  };

  const bothDel = () => {
    setDelURL(`${BASE_URL}${API_PATH.BOTH_DEL_FRIEND}`);
  };
  // 发起聊天
  const makeChat = async () => {
    try {
      const res = await postData(`${BASE_URL}${API_PATH.MAKE_CHAT}`, {
        Sender: state.userInfo.userID,
        Recipient: UserID,
        token: state.userInfo.token,
      });

      const resp: RESP_TYPE = await res.json();

      if (resp.code === 200) {
        // 分发dispatch修改全局的chatlist，resp.data = chatItem
        dispatch({type: stateStatus.APPEND_CHATITEM, playloads: resp.data});
        // 点击跳转前，dispatch分发chatInfo需要的数据，因为不这样比较难进行跨路由父子组件传值
        dispatch({
          type: stateStatus.SET_CHAT_DATA,
          playloads: resp.data,
        });
        navigation.navigate('ChatRoomPage', {
          showTitle: NickName,
          isChangeTitle: true,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={InfoStyle.container}>
      <View style={InfoStyle.userWrap}>
        <Image source={{uri: Avatar}} style={InfoStyle.ImgStyle} />
        <View style={InfoStyle.TextWrap}>
          <Text style={InfoStyle.nameText}>{NickName}</Text>
          <Text style={InfoStyle.otherText}>账号:{Username}</Text>
          <Text style={InfoStyle.otherText}>
            添加日期:{dateFormat(addtime, FormatsEnums._YMD)}
          </Text>
          <Text style={InfoStyle.otherText}>邮箱:{Email}</Text>
        </View>
      </View>
      {!friendFlag ? (
        <TouchableOpacity disabled={true}>
          <Text style={[InfoStyle.msgBtn, {fontSize: 16, color: 'grey'}]}>
            你们还不是好友哦
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <LongBtn
            showContent="加入黑名单"
            style={{marginTop: 10, matginBottom: 10}}
            disabled={true}>
            <Switch value={isBlacked} onChange={toggleBlacked} />
          </LongBtn>
          <View style={InfoStyle.BtnWrap}>
            <TouchableOpacity onPress={makeChat}>
              <Text style={InfoStyle.msgBtn}>发消息</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={delFriend}>
              <Text style={InfoStyle.delBtn}>删除</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* 被单删了 */}
      {firendStatus !== -1 && !friendFlag && (
        <TouchableOpacity onPress={bothDel}>
          <Text style={InfoStyle.delBtn}>从列表移除</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FriendInofo;
