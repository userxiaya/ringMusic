import {Dimensions, StyleSheet} from 'react-native';
const {width: clientWidth} = Dimensions.get('window');
import {footer} from '@/themeStyle';

export default (cols: number) => {
  const colWidth = (clientWidth - 40) / cols;
  return StyleSheet.create({
    footer: footer.style,
    list: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    items: {
      alignItems: 'center',
      width: colWidth,
      minHeight: colWidth,
      height: 'auto',
      marginBottom: 10,
      marginLeft: 10,
      position: 'relative',
      zIndex: 1,
    },
    image: {
      borderRadius: 10,
      width: colWidth,
      height: colWidth,
    },
    listen: {
      height: 20,
      width: '100%',
      lineHeight: 20,
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      backgroundColor:
        'linear-gradient(180deg,rgba(0, 0, 0, 0.04),rgba(0, 0, 0, 0))',
    },
    listen_icon_content: {
      width: 'auto',
      height: '100%',
      marginRight: 2,
      justifyContent: 'center',
    },
    listen_icon: {
      tintColor: '#fff',
      width: 12,
      height: 12,
    },
    listen_text: {
      color: '#fff',
      textAlignVertical: 'center',
      fontSize: 9,
      marginRight: 5,
      height: '100%',
    },
    message: {
      marginTop: 5,
      fontSize: 12,
    },
  });
};
