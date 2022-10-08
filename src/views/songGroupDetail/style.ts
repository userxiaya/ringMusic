import {StyleSheet} from 'react-native';
import {footer} from '@/themeStyle';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  top_container: {
    height: 190,
    paddingLeft: 10,
    paddingRight: 10,
  },
  top_container_content: {
    width: '100%',
    height: 90,
  },
  top_container_desc: {
    width: '100%',
    height: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  mess_content: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingLeft: 105,
    paddingRight: 15,
  },
  play_name: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 18,
  },
  userName: {
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  userName_text: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 22,
  },
  userIcon: {
    width: 14,
    height: 14,
    borderRadius: 14,
    marginRight: 5,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  desc: {
    marginTop: 5,
    flex: 1,
    position: 'relative',
    paddingRight: 15,
    overflow: 'hidden',
  },
  desc_icon: {
    width: 10,
    height: 10,
    tintColor: '#fff',
  },
  desc_icon_content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // textAlignVertical: 'center',
    height: '100%',
    right: 0,
  },
  desc_text: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 10,
  },
  footer: footer.style,
});
