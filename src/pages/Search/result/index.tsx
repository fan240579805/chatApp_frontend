import React from 'react';
import {TouchableOpacity, FlatList} from 'react-native';
import FriendListItem from '../../FriendsList/listItem'
interface Props {
  navigation: any;
}

const render = (navigation, item) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('FriendInfo', {
          userName: String(item),
          isChangeTitle: true,
          avatarUrl:
            'https://img0.baidu.com/it/u=2991084227,3927319913&fm=26&fmt=auto',
        });
      }}>
      <FriendListItem
        showTitle={item}
        avatarUrl="https://img0.baidu.com/it/u=2991084227,3927319913&fm=26&fmt=auto"
      />
    </TouchableOpacity>
  );
};

const Result: React.FC<Props> = ({navigation}) => {
  return (
    <FlatList
      data={[123, 13, 14, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99, 22]}
      renderItem={({item}) => render(navigation, item)}
      keyExtractor={item => String(item)}
    />
  );
};

export default Result;
