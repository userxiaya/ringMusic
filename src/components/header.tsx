import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useCreation} from 'ahooks';
import React, {useContext, ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  Platform,
  StyleProp,
  TextStyle,
  LayoutChangeEvent,
} from 'react-native';
import Icon from '@/components/icon';
import {ThemeContext} from '@/store/theme';
import LinearGradient from 'react-native-linear-gradient';

const {StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: STATUSBAR_HEIGHT + 40,
    paddingTop: STATUSBAR_HEIGHT,
  },
  relative: {
    width: '100%',
    height: 40,
    position: 'relative',
  },
  header_container: {
    position: 'absolute',
    width: '100%',
    height: STATUSBAR_HEIGHT + 40,
    top: 0,
    left: 0,
  },
  back: {
    height: '100%',
    width: '20%',
    textAlignVertical: 'center',
    paddingLeft: 10,
  },
  title: {
    margin: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    width: '60%',
    position: 'absolute',
    left: '20%',
    top: 0,
    height: '100%',
  },
  right: {
    height: '100%',
    width: '20%',
    position: 'absolute',
    right: 0,
    top: 0,
    overflow: 'hidden',
  },
  full: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
    justifyContent: 'center',
  },
});
interface HeaderProps {
  title?: string;
  color?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  style?: StyleProp<TextStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
  LinearColors?: string[];
  opacity?: number;
}
const Header = ({
  title,
  color,
  leftContent,
  rightContent,
  style: propsStyle,
  onLayout,
  LinearColors = ['#fff', '#fff'],
  opacity = 1,
}: HeaderProps) => {
  const navigation = useNavigation();
  const routesLength = useNavigationState(state => state.routes.length);
  const {state: theme} = useContext(ThemeContext);
  const backContent = useCreation(() => {
    return (
      routesLength > 1 && (
        <Icon
          name="icon-back_android"
          size={24}
          color={color || theme?.text_color}
          style={[styles.back]}
          onPress={() => {
            navigation.goBack();
          }}
        />
      )
    );
  }, [routesLength, color]);
  return (
    <View onLayout={onLayout} style={[styles.header, propsStyle]}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header_container, {opacity}]}
        colors={LinearColors}
      />
      <View style={styles.relative}>
        {leftContent ?? backContent}
        <Text
          style={[styles.title, {color: color || theme?.text_color}]}
          numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.right]}>
          <View style={[styles.full]}>{rightContent}</View>
        </View>
      </View>
    </View>
  );
};
export default Header;
