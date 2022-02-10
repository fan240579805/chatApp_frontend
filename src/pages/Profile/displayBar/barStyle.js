import {StyleSheet} from 'react-native';

export const barStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
    marginBottom: 20,
  },
  baseTitle: {
    fontSize: 13,
  },
  baseNum: {
    fontSize: 18,
    color: '#000',
    marginBottom: 7,
  },
  baseItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackListItem: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e3e3e3',
  },
  unDistrubItem: {
    borderRightWidth: 1,
    borderColor: '#e3e3e3',
  },
});
