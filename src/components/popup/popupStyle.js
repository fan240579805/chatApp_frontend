import {StyleSheet} from 'react-native';

export const popupStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,.5)',
    zIndex: 99,
  },
  titleWrap: {
    fontSize: 13,
    padding: 5,
    borderRadius: 5,
    color: '#fff',
  },
});
