import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

/**
 * @param route nav route对象，包含路由参数，路由name
 * @returns 需要更改的title
 */
export function getHeaderTitle(route: any): string {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatList';
  const isShowTitle = route?.params?.isChangeTitle ?? false;
  const defaultName = route?.params?.showTitle ?? '';
  if (isShowTitle) {
    return defaultName;
  }
  switch (routeName) {
    case 'ChatList':
      return 'ChatList';
    case 'FriendsList':
      return 'My FriendList';
    case 'Profile':
      return 'My profile';
    case 'Search':
      return 'My Search';
    default:
      return defaultName;
  }
}
