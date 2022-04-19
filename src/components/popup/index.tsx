import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import {operateType} from '../../type/props_type';
import {popupStyle} from './popupStyle';

interface PopupProps {
  operations: Array<operateType>;
  propsHeight?: number;
}

const Popup: React.FC<PopupProps> = ({operations, propsHeight = 30}) => {
  return (
    <View style={[popupStyle.container, {height: propsHeight}]}>
      {operations.map(({title, execfunc}) => {
        return (
          <TouchableHighlight
            underlayColor="#3333"
            key={title}
            onPress={execfunc}>
            <Text style={popupStyle.titleWrap}>{title}</Text>
          </TouchableHighlight>
        );
      })}
    </View>
  );
};

export default Popup;
