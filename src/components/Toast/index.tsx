/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {toastStyle} from './toastStyle';

interface itemProps {
  showContent: string;
  Icon?: string;
}

let Toast: React.FC<itemProps> = ({showContent, Icon}) => {
  const [delay, setdelay] = useState(3000);
  const [isShow, setShow] = useState(true);
  useEffect(() => {
    let timer = setTimeout(() => {
      setShow(false);
    }, delay);
    return () => {
      clearTimeout(timer);
      timer = null;
    };
  }, [delay]);
  return (
    <View style={toastStyle.container}>
      {isShow && (
        <View style={toastStyle.Wrap}>
          <Text style={toastStyle.content}>{showContent}</Text>
          <Ionicons name={Icon} size={30} color="#fff" />
        </View>
      )}
    </View>
  );
};

export default Toast;
