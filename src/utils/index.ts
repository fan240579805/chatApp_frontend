import { friendItemType } from "../type/state_type";

// 将请求到的好友列表处理一下
export const formatList = (datalist: Array<friendItemType>): Array<friendItemType> => {
  // willexecFriendlist 待处理的好友请求列表
  let willexecFriendlist = datalist.filter(friend => {
    return friend.Status === -1;
  });
  willexecFriendlist.length > 0 &&
    willexecFriendlist.unshift({
      FriendProfile: null,
      AddTime: '',
      Status: -100,
      IsMaster: false,
    });
  // hasFriendlist 已经成为好友的好友列表
  let hasFriendlist = datalist.filter(friend => {
    return friend.Status !== -1;
  });
  // 分隔待处理列表和好友列表的分界标志
  hasFriendlist.length > 0 &&
    hasFriendlist.unshift({
      FriendProfile: null,
      AddTime: '',
      Status: -404,
      IsMaster: false,
    });
  return [...willexecFriendlist, ...hasFriendlist];
};
