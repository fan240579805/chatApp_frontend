import {StyleSheet} from 'react-native';

export const listStyle = StyleSheet.create({
  container: {
    width: '100%',
    height: 65,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  imgWrap: {
    flex: 1,
  },
  avatarWrap: {},
  unReadStyle: {
    position: 'absolute',
    padding: 3,
    textAlign: 'center',
    minWidth: 18,
    minHeight: 10,
    fontSize: 10,
    lineHeight: 12,
    color: '#fff',
    right: -10,
    top: -8,
    backgroundColor: 'red',
    borderRadius: 9,
  },
  imgStyle: {
    width: 42,
    height: 42,
  },
  contentWrap: {
    flex: 5,
    justifyContent: 'center',
    marginLeft: 10,
    borderBottomColor: '#fefefe',
    borderBottomWidth: 1,
    paddingBottom: 18,
  },
  timeWrap: {
    flex: 1,
    borderBottomColor: '#fefefe',
    borderBottomWidth: 1,
  },
  timeTxt: {
    fontSize: 12,
  },
});
