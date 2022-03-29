import {StyleSheet} from 'react-native';

export const bottomStyle = StyleSheet.create({
  activeBottomToolHead: {
    position: 'absolute',
    marginBottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(178,178,178,0)',
  },
  bottomToolHead: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(178,178,178,0)',
  },
  VoiceBtn: {
    flex: 4.5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 4,
    maxHeight: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  iconWrap: {
    flex: 1,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subBtn: {
    width: '13%',
    justifyContent: 'center',
    marginRight: 10,
  },
});
