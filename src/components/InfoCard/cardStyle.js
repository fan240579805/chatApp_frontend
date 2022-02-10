import {StyleSheet} from 'react-native';

export const cardStyle = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    marginTop: 30,
    borderRadius: 10,
  },
  FlexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 60,
    marginTop: 15,
  },
  imgWrap: {
    flex: 1,
  },
  imgStyle: {
    width: 55,
    height: 55,
    marginLeft: 13,
    borderRadius: 6,
  },
  contentWrap: {
    flex: 5,
    justifyContent: 'center',
    marginLeft: 15,
  },
  textArea: {
    fontSize: 14,
    marginBottom: 8,
  },
});
