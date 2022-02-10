import {StyleSheet} from 'react-native';

export const BtnStyle = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    width: '100%',
    paddingLeft: 11,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 5,
    marginLeft: 18,
    fontSize: 15,
    color: 'grey',
  },
});
