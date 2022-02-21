import {StyleSheet} from 'react-native';

export const chatRoomStyle = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
  },
  chatContent: {
    width: '100%',
    height: '92%',
  },

  bottomToolBody: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  toolBtn: {
    backgroundColor: '#fff',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20,
  }
});
