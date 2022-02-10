import {StyleSheet} from 'react-native';

export const bubbleStyle = StyleSheet.create({
  LeftContainer: {
    width: '100%',
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  RightContainer: {
    width: '100%',
    marginRight: -10,
    marginTop: 10,
    flexDirection: 'row-reverse',
  },
  LeftBubbleWrap: {
    maxWidth: '50%',
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  RightBubbleWrap: {
    maxWidth: '50%',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: 'rgb(0, 170, 255)',
  },
  textContent: {
    fontSize: 16,
    color: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  contentImage: {
    margin: 10,
    marginTop: 0,
    borderRadius: 10,
  },
});
