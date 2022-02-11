import {StyleSheet} from 'react-native';

export const itemStyle = StyleSheet.create({
  container: {
    width: '100%',
    marginTop:15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  imgWrap: {
    flex: 1,
  },
  imgStyle: {
    width: 40,
    height: 40,
    marginLeft: 5,
    borderRadius:5,
  },
  contentWrap: {
    flex: 5,
    height: 47,
    justifyContent: 'center',
    marginLeft: 15,
    borderBottomColor: '#fefefe',
    borderBottomWidth: 1,
    paddingBottom: 11,
  },
  addBtn:{
    height:30,
    alignItems:'center',
    justifyContent: 'center',
    marginRight:5,
    borderRadius:5,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:"rgb(97, 196, 85)"
  },
});
