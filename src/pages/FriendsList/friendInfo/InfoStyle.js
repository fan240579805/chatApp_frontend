import {StyleSheet} from 'react-native';

export const InfoStyle = StyleSheet.create({
  container: {},
  TextWrap: {
    width: '70%',
    marginLeft: 20,
  },
  userWrap: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
  },
  ImgStyle: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  nameText: {
    fontSize: 22,
    color: '#000',
    fontWeight: '600',
    marginBottom: 10,
  },
  otherText: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 5,
  },
  BtnWrap: {},
  msgBtn: {
    padding: 13,
    marginTop: 10,
    color: 'rgb(0, 138, 211)',
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  delBtn: {
    padding: 10,
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
    fontSize: 17,
    backgroundColor: '#fff',
    fontWeight: '600',
  },
});
