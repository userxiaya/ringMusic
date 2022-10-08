import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  songItem: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    overflow: 'hidden',
    paddingRight: 10,
    paddingLeft: 10,
  },
  index: {
    fontSize: 16,
    color: '#000',
    height: '100%',
    width: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  message_container: {
    flex: 1,
  },
  more_container: {
    height: '100%',
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  more: {
    width: 23,
    height: 23,
  },
  name: {
    height: 25,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'center',
  },
  singer_name: {
    color: '#969799',
    height: 15,
    fontSize: 12,
    textAlignVertical: 'center',
  },
});
