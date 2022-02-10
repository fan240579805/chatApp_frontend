/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BtnStyle} from './BtnStyle';

interface itemProps {
  FrontIcon?: string;
  showContent: string;
  EndIcon?: string;
  onPress: () => void;
  style?: any;
}

const longBtn: React.FC<itemProps> = ({
  FrontIcon,
  showContent,
  EndIcon,
  onPress,
  style,
  children,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[BtnStyle.container, style]}>
        {FrontIcon && <Ionicons name={FrontIcon} size={23} />}
        <Text style={BtnStyle.content}>{showContent}</Text>
        {EndIcon && <Ionicons name={EndIcon} size={23} />}
        {!EndIcon && children}
      </View>
    </TouchableOpacity>
  );
};

export default longBtn;
