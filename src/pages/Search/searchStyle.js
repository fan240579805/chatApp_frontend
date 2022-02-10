import {StyleSheet} from 'react-native';

export const searchStyle = StyleSheet.create({
  container: {},
  inputWrap: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
    paddingRight: 30,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  cancelBtn: {
    height: 40,
    position: 'absolute',
    top: '22%',
    right: '17%',
  },
  searchBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tip: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
});
