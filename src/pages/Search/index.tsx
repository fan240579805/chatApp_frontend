/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {TextInput, View, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {searchStyle} from './searchStyle';
interface searcgProps {}

const Search: React.FC<searcgProps> = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <View>
      <View style={searchStyle.inputWrap}>
        <TextInput
          style={searchStyle.input}
          maxLength={100}
          placeholder="输入..."
          value={inputValue}
          onChangeText={text => setInputValue(text)}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setInputValue('');
            }}
            style={searchStyle.cancelBtn}>
            <MaterialIcons name="cancel" size={21} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => {}} style={searchStyle.searchBtn}>
          <Text style={{fontSize: 16}}>搜索</Text>
        </TouchableOpacity>
      </View>
      <Text style={searchStyle.tip}>搜索唯一账号添加...</Text>
    </View>
  );
};

export default Search;
