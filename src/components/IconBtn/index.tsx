import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {TouchableWithoutFeedback} from 'react-native';

interface Props {
  iconName: string;
  size: number;
  color?: string;
  pressHandle: () => void;
}
// 路由跳转所开启的新页面
const IconBtn: React.FC<Props> = ({iconName, size, color, pressHandle}) => {
  return (
    <TouchableWithoutFeedback onPress={pressHandle}>
      <Ionicons name={iconName} size={size} color={color} />
    </TouchableWithoutFeedback>
  );
};

export default IconBtn;
