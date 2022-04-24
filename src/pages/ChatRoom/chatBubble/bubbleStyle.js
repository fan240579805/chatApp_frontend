import {StyleSheet} from 'react-native';

export const bubbleStyle = StyleSheet.create({
  LeftContainer: {
    width: '100%',
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
  },
  RightContainer: {
    width: '100%',
    marginRight: -10,
    marginTop: 20,
    flexDirection: 'row-reverse',
  },
  LeftBubbleWrap: {
    maxWidth: '50%',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
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
  leftvoiceFlex: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    width: 80,
  },
  rightVoiceFlex: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 80,
  },
  voiceSecond: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    fontWeight: '600',
    marginRight: 5,
    marginLeft: 5,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  timeWrap: {
    position: 'absolute',
    top: -16,
    left: 50,
    fontSize: 12,
    color: '#999',
  },
});
