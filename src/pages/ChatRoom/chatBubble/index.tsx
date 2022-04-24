import React, {useState, useImperativeHandle, useContext} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Popup from '../../../components/popup';
import {bubbleStyle} from './bubbleStyle';
import {operateType} from '../../../type/props_type';
import {ctxPassThroughType, msgType} from '../../../type/state_type';
import useResizeImg from '../../../hooks/resizeImgHook';
import Icon from 'react-native-vector-icons/Ionicons';
import {usePlaySound} from '../../../hooks/playSoundHook';
import {postData} from '../../../network/postData';
import {API_PATH, BASE_URL, stateStatus} from '../../../const';
import {Context} from '../../../state/stateContext';
import {ActionType, MsgStatus} from '../../../reducers/msgListReducer';
import {showTips} from '../../../network/postDataHook';
import {dateFormat, FormatsEnums} from '../../../utils/common/time';

interface bubbleProps extends msgType {
  cRef: any;
  closePopup: () => void;
  dispatchMsg: React.Dispatch<ActionType>;
}

const ChatBubble: React.FC<bubbleProps> = ({msgid, type, content, time, isSender, avatarUrl, closePopup, cRef, dispatchMsg}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [isShow, setShow] = useState(false);

  // 将子组件内部状态方法暴露给父组件的ref以便调用
  useImperativeHandle(
    cRef,
    () => ({
      isShow: isShow,
      changeShow: (value: boolean) => setShow(value),
    }),
    [isShow],
  );
  // 获取通过判断图片宽高的新大小
  const [img_width, img_height] = useResizeImg(type, content);

  const [duration, curTime, showTime, playSound, pauseSound, isPlaying, setisPlay] = usePlaySound(type, content);

  const bothDelMsg = async () => {
    try {
      const resp = await postData(`${BASE_URL}${API_PATH.BOTH_DEL_MSG}`, {
        token: state.userInfo.token,
        MsgID: msgid,
        ChatID: state.CurChatItem.ChatID,
        Myself: state.userInfo.userID,
        Other: state.CurChatItem.ChatToUserID,
      });
      const res = await resp.json();
      if (res.code === 200) {
        dispatchMsg({type: MsgStatus.REMOVE_CUR_MSG, playloads: msgid});
        dispatch({
          type: stateStatus.UPDATE_RECENT_MSG,
          playloads: {curChatID: state.CurChatItem.ChatID, RecentMsg: res.data},
        });
        showTips('撤回成功');
      }
    } catch (error) {
      console.log('撤回失败');
      showTips('撤回失败');
    }
  };

  return (
    <View style={isSender ? bubbleStyle.RightContainer : bubbleStyle.LeftContainer}>
      <TouchableOpacity
        onPress={() => {
          closePopup();
          // navigation.navigate('FriendInfo', {
          //   userName: 'asd',
          //   isChangeTitle: true,
          //   avatarUrl:avatarUrl,
          // });
        }}>
        <Image source={{uri: avatarUrl}} style={bubbleStyle.avatar} />
      </TouchableOpacity>
      {type === 'text' && (
        <TouchableOpacity
          onPress={() => closePopup()}
          onLongPress={() => {
            closePopup();
            setShow(true);
          }}
          style={isSender ? bubbleStyle.RightBubbleWrap : bubbleStyle.LeftBubbleWrap}>
          <Text style={bubbleStyle.textContent} selectable={true}>
            {content}
          </Text>
        </TouchableOpacity>
      )}
      {type === 'img' && (
        <TouchableOpacity
          onPress={() => closePopup()}
          onLongPress={() => {
            closePopup();
            setShow(true);
          }}>
          <Image
            width={img_width}
            height={img_height}
            source={{uri: content}}
            style={{
              height: img_height,
              width: img_width,
              margin: 10,
              marginTop: 0,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
      )}
      {type === 'audio' && (
        <TouchableOpacity
          onPress={() => {
            closePopup();
            !isPlaying && playSound();
            isPlaying && pauseSound();
          }}
          onLongPress={() => {
            closePopup();
            setShow(true);
          }}
          style={[
            isSender ? bubbleStyle.RightBubbleWrap : bubbleStyle.LeftBubbleWrap,
            isSender ? bubbleStyle.rightVoiceFlex : bubbleStyle.leftvoiceFlex,
          ]}>
          <Text style={bubbleStyle.voiceSecond}>{showTime + '"'}</Text>
          <Icon name="mic-outline" color="#666" size={22} />
        </TouchableOpacity>
      )}
      <Text style={bubbleStyle.timeWrap}>{dateFormat(time, FormatsEnums.MDHI)}</Text>
      {isShow && isSender && <Popup operations={[{title: '撤回', execfunc: bothDelMsg}]} />}
      {isShow && !isSender && (
        <Popup
          operations={[
            {
              title: '删除',
              execfunc: () => {
                console.log('del');
              },
            },
          ]}
        />
      )}
    </View>
  );
};

export default ChatBubble;
