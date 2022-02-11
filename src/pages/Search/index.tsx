/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {TextInput, View, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_PATH, BASE_URL} from '../../const';
import usePostData, {PostdataType} from '../../network/postDataHook';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType} from '../../type/state_type';
import SearchResult from './result';

import {searchStyle} from './searchStyle';
interface searchProps {}

const Search: React.FC<searchProps> = () => {
  const [inputValue, setInputValue] = useState('');
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  const [
    submitData,
    setURL,
    {isError, isFetching, data},
    dispatchNewData,
  ]: PostdataType = usePostData({
    initUrl: `${BASE_URL}${API_PATH.SEARCH_USER}/${inputValue}`,
    initData: {},
  });
  const search = () => {
    setURL(`${BASE_URL}${API_PATH.SEARCH_USER}/${inputValue}`);
    submitData({token: state.userInfo.token});
  };
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
        <TouchableOpacity
          onPress={() => {
            search();
          }}
          style={searchStyle.searchBtn}>
          <Text style={{fontSize: 16}}>搜索</Text>
        </TouchableOpacity>
      </View>
      {data.userInfo && (
        <SearchResult
          {...data.userInfo}
          Status={data.status}
          dispatchNewData={dispatchNewData}
        />
      )}
      <Text style={searchStyle.tip}>搜索唯一账号添加...</Text>
    </View>
  );
};

export default Search;
