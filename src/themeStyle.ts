import {Dimensions, StyleSheet} from 'react-native';
const {width: clientWidth} = Dimensions.get('window');
export const footer = StyleSheet.create({
  style: {
    width: clientWidth,
    height: 'auto',
    paddingBottom: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
});
