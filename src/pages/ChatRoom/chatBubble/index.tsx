import React, {useState, useImperativeHandle} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Popup from '../../../components/popup';
import {bubbleStyle} from './bubbleStyle';
import {operateType} from '../../../type/props_type';
import {msgType} from '../../../type/state_type';
import useResizeImg from '../../../hooks/resizeImgHook';
import Icon from 'react-native-vector-icons/Ionicons';
import {usePlaySound} from '../../../hooks/playSoundHook';

interface bubbleProps extends msgType {
  cRef: any;
  closePopup: () => void;
  navigation: any;
}

const ChatBubble: React.FC<bubbleProps> = ({
  msgid,
  type,
  content,
  time,
  isSender,
  avatarUrl,
  ownerid,
  otherid,
  closePopup,
  cRef,
  navigation,
}) => {
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

  const [
    duration,
    curTime,
    showTime,
    playSound,
    pauseSound,
    isPlaying,
    setisPlay,
  ] = usePlaySound(type, content);

  const operations: Array<operateType> = [
    {title: '删除', execfunc: () => console.log('del')},
    {title: '撤回', execfunc: () => console.log('che')},
  ];
  return (
    <View
      style={isSender ? bubbleStyle.RightContainer : bubbleStyle.LeftContainer}>
      <TouchableOpacity
        onPress={() => {
          closePopup();
          navigation.navigate('FriendInfo', {
            // 展示写死后续记得改！
            userName: 'asd',
            isChangeTitle: true,
            avatarUrl:
              'https://img0.baidu.com/it/u=2991084227,3927319913&fm=26&fmt=auto',
          });
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
          style={
            isSender ? bubbleStyle.RightBubbleWrap : bubbleStyle.LeftBubbleWrap
          }>
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
      {isShow && <Popup operations={operations} />}
    </View>
  );
};

export default ChatBubble;
