/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {Text, View, Image} from 'react-native';
import {listStyle} from './listItemStyle';
import {chatListItemType, ctxPassThroughType} from '../../../type/state_type';
import {dateFormat, FormatsEnums} from '../../../utils/common/time';
import {Context} from '../../../state/stateContext';

interface itemProps extends chatListItemType {
  isTop?: boolean;
  isMineUnread?: boolean;
}

const ChatListItem: React.FC<itemProps> = ({
  ChatID,
  RecentMsg,
  ChatToNickName,
  UnRead,
  ChatToUserID,
  ChatToUserAvatar,
  RecentTime,
  isTop,
  isMineUnread,
}) => {
  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  // 当前最新消息的recipient是当前登录用户的话，说明未读消息是自己的
  // const [isMineUnread, setMineUnreadFlag] = useState(
  //   RecentMsg.recipient === state.userInfo.userID,
  // );
  return (
    <View
      style={
        isTop
          ? [listStyle.container, {backgroundColor: '#e9e9e9'}]
          : listStyle.container
      }>
      <View style={listStyle.avatarWrap}>
        <Image source={{uri: ChatToUserAvatar}} style={listStyle.imgStyle} />
        {UnRead > 0 && isMineUnread && <Text style={listStyle.unReadStyle}>{UnRead}</Text>}
      </View>
      <View style={listStyle.contentWrap}>
        <Text style={{fontSize: 18}}>{ChatToNickName}</Text>
        <Text style={{fontSize: 14}} numberOfLines={1}>
          {RecentMsg && RecentMsg.type === 'text' && RecentMsg.content}
          {RecentMsg && RecentMsg.type === 'img' && '[图片]'}
          {RecentMsg && RecentMsg.type === 'audio' && '[语音]'}
        </Text>
      </View>

      <View style={listStyle.timeWrap}>
        <Text style={{fontSize: 12}}>
          {dateFormat(RecentTime, FormatsEnums._MD)}
        </Text>
      </View>
    </View>
  );
};

export default ChatListItem;
