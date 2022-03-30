/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
  KeyboardEvent,
  Text,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useVoiceAction} from '../../../hooks/voiceHook';
import {showTips} from '../../../network/postDataHook';
import {wsInstance} from '../../../network/websocket';
import {Context} from '../../../state/stateContext';
import {ctxPassThroughType} from '../../../type/state_type';
import {bottomStyle} from './bottomStyle';

import Toast from '../../../components/Toast';

interface bottomProps {
  ToolHeight: number;
  bottomStatus: number;
  setBottomStatus: (value: number) => void;
  setContentHeight: (value: number) => void;
  chatID: string;
  recipient: string;
  inputCmpRef: any;
  canChat: boolean;
}

const BottomTool: React.FC<bottomProps> = ({
  ToolHeight,
  bottomStatus,
  setBottomStatus,
  setContentHeight,
  chatID,
  recipient,
  inputCmpRef,
  canChat,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [keyb, setKeyBoradHeight] = useState(0);
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [isSound, setIsSound] = useState(false);

  const [_startRecognizing, _stopRecognizing, recording] = useVoiceAction();

  useImperativeHandle(
    inputCmpRef,
    () => ({
      inputValue,
      setInputValue,
    }),
    [inputValue, inputCmpRef],
  );

  // input实例
  const inputRef = useRef<any>(null);
  const inputContainerRef = useRef<any>(null);
  let keyBoardHeight = 0;
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  const _keyboardDidShow = (e: KeyboardEvent) => {
    // 将键盘高度设置为工具栏高度
    keyBoardHeight = e.endCoordinates.height;
    if (keyBoardHeight - ToolHeight > 100) {
      setKeyBoradHeight(e.endCoordinates.height);
    }
  };

  const _keyboardDidHide = () => {
    setKeyBoradHeight(keyBoardHeight);
  };

  // 切换键盘表情时执行重置聊天内容区域
  const _resetChatHeight = () => {
    if (inputContainerRef) {
      inputContainerRef?.current?.measure(
        (
          x: any,
          y: any,
          width: any,
          height: any,
          pageX: any,
          pageY: number,
        ) => {
          bottomStatus !== 0 && setContentHeight(pageY - 70);
        },
      );
    }
  };
  const sendChatMessage = () => {
    if (canChat) {
      wsInstance.sendMessage(
        JSON.stringify({
          ChatID: chatID,
          Message: {
            Sender: state.userInfo.userID,
            Recipient: recipient,
            Content: inputValue,
            Type: 'text',
          },
        }),
      );
    } else {
      showTips('你们的好友关系拉黑或删除，无法聊天');
    }
  };
  return (
    <>
      <View
        ref={inputContainerRef}
        style={
          bottomStatus !== 1 && bottomStatus !== 0
            ? [bottomStyle.activeBottomToolHead, {bottom: ToolHeight || '40%'}]
            : bottomStyle.bottomToolHead
        }
        onLayout={() => {
          _resetChatHeight();
        }}>
        <TouchableOpacity
          style={bottomStyle.iconWrap}
          onPress={() => setIsSound(!isSound)}>
          <MaterialIcons name="contactless" size={35} />
        </TouchableOpacity>
        {isSound && (
          <TouchableOpacity
            style={bottomStyle.VoiceBtn}
            onLongPress={() => {
              _startRecognizing();
            }}
            onPressOut={() => {
              _stopRecognizing();
            }}>
            <Text>长按开始录音</Text>
          </TouchableOpacity>
        )}
        <TextInput
          ref={inputRef}
          value={inputValue}
          onFocus={() => {
            setBottomStatus(1);
          }}
          multiline={true}
          onChangeText={text => setInputValue(text)}
          style={[bottomStyle.input, {display: isSound ? 'none' : 'flex'}]}
        />
        {bottomStatus !== 2 && (
          <TouchableOpacity
            style={bottomStyle.iconWrap}
            onPress={() => {
              setIsSound(false);
              inputRef.current.blur();
              setTimeout(() => {
                setBottomStatus(2);
              }, 1);
              setTimeout(() => {
                _resetChatHeight();
              }, 10);
            }}
            activeOpacity={1}>
            <MaterialIcons name="emoji-emotions" size={35} />
          </TouchableOpacity>
        )}
        {bottomStatus === 2 && (
          <TouchableOpacity
            style={bottomStyle.iconWrap}
            onPress={() => {
              setIsSound(false);
              setBottomStatus(1);
              // setTimeout(() => {
              inputRef.current.focus();
              // }, 2);
            }}
            activeOpacity={1}>
            <MaterialIcons name="keyboard" size={35} />
          </TouchableOpacity>
        )}
        {inputValue.trim().length === 0 && (
          <TouchableOpacity
            style={bottomStyle.iconWrap}
            onPress={() => {
              Keyboard.dismiss();
              setIsSound(false);
              setTimeout(() => {
                setBottomStatus(3);
              }, 1);
              setTimeout(() => {
                _resetChatHeight();
              }, 10);
            }}
            activeOpacity={1}>
            <View style={bottomStyle.iconWrap}>
              <MaterialIcons name="add" size={35} />
            </View>
          </TouchableOpacity>
        )}
        {inputValue.trim().length > 0 && (
          <View style={bottomStyle.subBtn}>
            <Button title="发送" onPress={() => sendChatMessage()} />
          </View>
        )}
      </View>
      {recording && <Toast showContent="录音中，释放手指发送" Icon="mic" />}
    </>
  );
};

export default BottomTool;
