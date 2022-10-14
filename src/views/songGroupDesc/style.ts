import {StyleSheet} from 'react-native';

const iconSize = 120;
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  iconContainer: {
    width: '100%',
    height: 'auto',
    marginTop: 50,
    alignItems: 'center',
  },
  icon: {
    width: iconSize,
    height: iconSize,
    borderRadius: 5,
  },
  desc: {
    flex: 1,
    marginTop: 12,
    paddingLeft: 30,
    paddingRight: 30,
  },
  userName: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  tag: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 12,
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 2,
    paddingBottom: 2,
    borderWidth: 1,
    marginRight: 10,
    borderColor: '#fff',
  },
});
