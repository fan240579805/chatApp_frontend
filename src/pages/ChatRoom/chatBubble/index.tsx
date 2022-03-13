import React, {useState, useImperativeHandle} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import Popup from '../../../components/popup';
import {bubbleStyle} from './bubbleStyle';
import {operateType} from '../../../type/props_type';
import {msgType} from '../../../type/state_type';
import useResizeImg from '../../../hooks/resizeImgHook';

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
            style={[
              {height: img_height, width: img_width},
              bubbleStyle.contentImage,
            ]}
          />
        </TouchableOpacity>
      )}
      {type === 'voice' && (
        <Image source={{uri: avatarUrl}} style={bubbleStyle.contentImage} />
      )}
      {isShow && <Popup operations={operations} />}
    </View>
  );
};

export default ChatBubble;
