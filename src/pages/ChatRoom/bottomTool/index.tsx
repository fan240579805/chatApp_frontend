/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {bottomStyle} from './bottomStyle';

interface bottomProps {
  ToolHeight: number;
  bottomStatus: number;
  setBottomStatus: (value: number) => void;
  setContentHeight: (value: number) => void;
  setToolHeight: (value: number) => void;
  scrollEnd: () => void;
}

const BottomTool: React.FC<bottomProps> = ({
  ToolHeight,
  bottomStatus,
  setBottomStatus,
  setContentHeight,
  setToolHeight,
  scrollEnd,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [keyb, setKeyBoradHeight] = useState(0);

  // input实例
  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);
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
        (x, y, width, height, pageX, pageY) => {
          bottomStatus !== 0 && setContentHeight(pageY - 70);
        },
      );
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
        <View style={bottomStyle.iconWrap}>
          <MaterialIcons name="contactless" size={35} />
        </View>
        <TextInput
          ref={inputRef}
          value={inputValue}
          onFocus={() => {
            setBottomStatus(1);
          }}
          multiline={true}
          onChangeText={text => setInputValue(text)}
          style={bottomStyle.input}
        />
        {bottomStatus !== 2 && (
          <TouchableOpacity
            style={bottomStyle.iconWrap}
            onPress={() => {
              inputRef.current.blur();
              setTimeout(() => {
                setBottomStatus(2);
              }, 82);
              setTimeout(() => {
                _resetChatHeight();
              }, 150);
            }}
            activeOpacity={1}>
            <MaterialIcons name="emoji-emotions" size={35} />
          </TouchableOpacity>
        )}
        {bottomStatus === 2 && (
          <TouchableOpacity
            style={bottomStyle.iconWrap}
            onPress={() => {
              setBottomStatus(1);
              setTimeout(() => {
                inputRef.current.focus();
              }, 82);
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
              setTimeout(() => {
                setBottomStatus(3);
              }, 82);
              setTimeout(() => {
                _resetChatHeight();
              }, 150);
            }}
            activeOpacity={1}>
            <View style={bottomStyle.iconWrap}>
              <MaterialIcons name="add" size={35} />
            </View>
          </TouchableOpacity>
        )}
        {inputValue.trim().length > 0 && (
          <View style={bottomStyle.subBtn}>
            <Button title="发送" />
          </View>
        )}
      </View>
    </>
  );
};

export default BottomTool;
