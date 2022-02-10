import {StyleSheet} from 'react-native';

export const toastStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    marginTop: -50,
    marginLeft: -50,
  },
  Wrap: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: 10,
  },
  content: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});
