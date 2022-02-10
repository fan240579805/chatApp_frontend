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
