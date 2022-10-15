import {useNavigation} from '@react-navigation/native';
import React, {useContext, useRef} from 'react';
import {
  NativeModules,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ThemeContext} from '@/store/theme';
import Icon from '@/components/icon';
import {Text} from 'react-native-elements';
import {songChannel} from '@/utils/types';
import {songChannelList} from '@/utils/tools';
import {useControllableValue, useCreation} from 'ahooks';
const {StatusBarManager} = NativeModules;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;

const styles = StyleSheet.create({
  none: {
    position: 'absolute',
    top: 50,
    width: 200,
    right: -30,
    opacity: 0,
  },
  search_container: {
    width: '100%',
    height: 40,
    paddingLeft: 40,
    paddingRight: 70,
    position: 'relative',
    justifyContent: 'center',
    marginTop: STATUSBAR_HEIGHT + 5,
    marginBottom: 5,
  },
  search: {
    backgroundColor: '#fff',
    borderColor: '#999',
    borderWidth: 0.5,
    borderRadius: 20,
    height: '100%',
    paddingLeft: 30,
    paddingRight: 15,
    position: 'relative',
  },
  icon_search: {
    height: '100%',
    width: 30,
    textAlignVertical: 'center',
    paddingLeft: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  back: {
    height: '100%',
    width: 40,
    textAlignVertical: 'center',
    paddingLeft: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  right: {
    height: 40,
    width: 60,
    position: 'absolute',
    textAlign: 'center',
    textAlignVertical: 'center',
    right: 10,
    top: 0,
  },
});
interface SearchProps {
  value?: string;
  channel?: songChannel;
  onChange?: (value?: string) => void;
  onChannelChange?: (channel: songChannel) => void;
}
function SearchBar(props: SearchProps) {
  const navigation = useNavigation();
  const pickerRef = useRef<any>();
  const {state: theme} = useContext(ThemeContext);
  const selectText = useCreation(() => {
    const text =
      props.channel &&
      songChannelList.find(e => {
        return e.channel === props.channel;
      })?.label;
    return (
      <Text
        style={styles.right}
        onPress={() => {
          pickerRef?.current?.focus();
        }}>
        {text || '选择渠道'}
      </Text>
    );
  }, [props.channel]);
  const [state, setState] = useControllableValue<string | undefined>(props);
  return (
    <View style={styles.search_container}>
      <Icon
        name="icon-back_android"
        size={24}
        color={theme?.text_color}
        style={[styles.back]}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.search}>
        <Icon
          name="icon-search"
          size={18}
          color={'#999'}
          style={[styles.icon_search]}
        />
        <TextInput
          value={state}
          onChangeText={text => {
            setState(text);
          }}
        />
      </View>
      <Picker
        ref={picker => {
          pickerRef.current = picker;
        }}
        mode={'dialog'}
        style={styles.none}
        selectedValue={props.channel}
        onValueChange={(itemValue: songChannel) => {
          props?.onChannelChange?.(itemValue);
        }}>
        {songChannelList.map(item => (
          <Picker.Item
            label={item.label}
            value={item.channel}
            key={item.channel}
          />
        ))}
      </Picker>
      {selectText}
    </View>
  );
}
export default SearchBar;
