import React from 'react';
import {Text, View, Image, TouchableHighlight} from 'react-native';
import {SingerItem, songItemState} from '@/utils/types';
import styles from './style';
import {addSong, getSongDetail} from '@/utils/appTools';
import {useNavigation} from '@react-navigation/native';
import {useMemoizedFn} from 'ahooks';

interface SongItemProps {
  item: songItemState;
  index?: number;
}
const getSingerName = (singer?: SingerItem[]) => {
  if (!singer) {
    return [];
  }
  const result = singer.map(e => e.name);
  return result.join('/');
};

const SongItem = ({item}: SongItemProps) => {
  const navigation = useNavigation();
  const toSongChannelPage = useMemoizedFn(() => {
    navigation.navigate({
      name: 'WebContext',
      params: {url: getSongDetail(item)},
      merge: true,
    });
  });
  return (
    <TouchableHighlight
      underlayColor="#DDDDDD"
      onPress={() => {
        addSong(item);
      }}>
      <View style={[styles.songItem]}>
        <View style={[styles.message_container]}>
          <Text style={[styles.name]} numberOfLines={1}>
            {item?.name}
          </Text>
          <Text style={[styles.singer_name]} numberOfLines={1}>
            {getSingerName(item?.singer)}
          </Text>
        </View>
        <View style={[styles.more_container]}>
          <TouchableHighlight
            underlayColor="#DDDDDD"
            onPress={() => {
              toSongChannelPage();
            }}>
            <Image
              style={[styles.more]}
              source={require('@/assets/image/more_android_light.png')}
            />
          </TouchableHighlight>
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default SongItem;
