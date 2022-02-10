const {StyleSheet} = require('react-native');

export const formStyle = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: '15%',
    height: '100%',
    backgroundColor: '#fff',
  },
  signContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: '3%',
    height: '100%',
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 0.8,
    borderColor: '#e9e9e9',
    width: '80%',
    paddingBottom: 8,
  },
  WrongTextWrap: {
    width: '80%',
  },
  WrongText: {
    color: 'red',
    fontSize: 14,
  },
  subBtn: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 9,
    marginTop: 35,
    marginBottom: 20,
    backgroundColor: 'rgb(0, 170, 255)',
    borderRadius: 16,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  moreInfoWrap: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#eee',
    fontSize: 13,
  },
});
