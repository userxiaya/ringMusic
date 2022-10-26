import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {useCreation, useMemoizedFn, useRequest, useSafeState} from 'ahooks';
import {playDetail, songGroupItem, songItemState} from '@/utils/types';
import appTools, {getSongDetail} from '@/utils/appTools';
import LinearGradient from 'react-native-linear-gradient';
import {getPlayDetailApi as qqDetail} from '@/apis/qq';
import {getPlayDetailApi as netEaseDetail} from '@/apis/netEase';
import {getPlayDetailApi as kugouDetail} from '@/apis/kugou';
import Header from '@/components/header';
import styles from './style';
import SongItem from '@/components/songItem';
import {useNavigation, useRoute} from '@react-navigation/native';
import ActionSheet from 'react-native-actionsheet';

const apiMap: {
  [name: string]: (id: string) => Promise<playDetail>;
} = {
  QQ: qqDetail,
  netEase: netEaseDetail,
  kugou: kugouDetail,
};

interface DetailHeaderProps {
  playInfo?: playDetail;
  headerHeight?: number;
  LinearColors?: string[];
  groupData: songGroupItem;
}

function DetailHeader({
  playInfo,
  headerHeight = 0,
  LinearColors = [],
  groupData,
}: DetailHeaderProps) {
  const navigation = useNavigation();
  const headerHeightStyle = useCreation(() => {
    return StyleSheet.create({
      style: {
        paddingTop: headerHeight + 5,
      },
    });
  }, [headerHeight]);
  const gotToDesc = useMemoizedFn(() => {
    navigation.navigate('SongGroupDesc', groupData);
  });
  const Desc = useCreation(() => {
    const str = (playInfo?.desc || '').replace(/<br\/>|<br>/g, '');
    return (
      playInfo?.desc && (
        <Text style={styles.top_container_desc} numberOfLines={1}>
          {str}
        </Text>
      )
    );
  }, [playInfo]);
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={LinearColors}
      style={[styles.top_container, headerHeightStyle.style]}>
      <View style={[styles.top_container_content]}>
        <Image
          style={styles.image}
          source={{uri: playInfo?.imageUrl}}
          resizeMode="cover"
        />
        <View style={[styles.mess_content]}>
          <Text style={[styles.play_name]} numberOfLines={2}>
            {playInfo?.name}
          </Text>
          <View style={[styles.userName]}>
            <Image style={styles.userIcon} source={{uri: playInfo?.userIcon}} />
            <Text style={[styles.userName_text]}>{playInfo?.userName}</Text>
          </View>
          <TouchableHighlight
            underlayColor={''}
            onPress={() => {
              gotToDesc();
            }}>
            <View style={[styles.desc]}>
              {Desc}
              <View style={[styles.desc_icon_content]}>
                <Image
                  style={[styles.desc_icon]}
                  source={require('@/assets/image/next.png')}
                />
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </LinearGradient>
  );
}
const SongGroupDetail = () => {
  const route = useRoute();
  const [imageBackground, setBackground] = useSafeState<{
    startColor: string;
    endColor: string;
  } | null>(null);
  const [scrollY, setscrollY] = useSafeState<number>(0);
  const [headerHeight, setHeaderHeight] = useSafeState<number>(60);
  const params = useCreation(() => {
    const result = route.params as songGroupItem;
    return result;
  }, [route.params]);
  const {songChannel} = params;
  const service = apiMap[songChannel];
  const actionRef = useRef<any>(null);
  const actionItem = useRef<songItemState | null>(null);
  const navigation = useNavigation();
  const showAction = useMemoizedFn((item: songItemState) => {
    actionItem.current = item;
    actionRef.current?.show();
  });
  //渐变色
  const LinearColors = useCreation(() => {
    const defaultColor = [
      'rgb(255,255,255)',
      'rgb(255,255,255)',
      'rgb(255,255,255)',
    ];
    const result = imageBackground
      ? [
          `rgba(${imageBackground.startColor},1)`,
          `rgba(${imageBackground.startColor},0.8)`,
          `rgba(${imageBackground.startColor},0.6)`,
        ]
      : defaultColor;
    return result;
  }, [imageBackground]);
  //渐变色
  // const LinearColors1 = useCreation(() => {
  //   const defaultColor = [
  //     'rgb(255,255,255)',
  //     'rgb(255,255,255)',
  //     'rgb(255,255,255)',
  //   ];
  //   const result = imageBackground
  //     ? [
  //         `rgba(${imageBackground.startColor},1)`,
  //         `rgba(${imageBackground.startColor},1)`,
  //         `rgba(${imageBackground.startColor},1)`,
  //       ]
  //     : defaultColor;
  //   return result;
  // }, [imageBackground, scrollY]);

  const {data: playInfo, loading} = useRequest(
    () => service?.(params.id) as Promise<playDetail>,
  );
  useEffect(() => {
    if (playInfo) {
      const {imageUrl} = playInfo;
      appTools.getBackGroundByImage(
        imageUrl,
        (result: any) => {
          setBackground(result);
        },
        () => {},
      );
    }
  }, [playInfo, setBackground]);
  const onHeadLayout = useMemoizedFn(({nativeEvent}: LayoutChangeEvent) => {
    setHeaderHeight(nativeEvent.layout.height);
  });

  const headContainer = useCreation(() => {
    const opacity = scrollY / 190; //列表头部元素高度
    return (
      <Header
        color={'#fff'}
        onLayout={onHeadLayout}
        title={opacity > 0.7 ? playInfo?.name : '歌单'}
        style={[styles.header]}
        opacity={opacity > 1 ? 1 : opacity}
        LinearColors={LinearColors}
      />
    );
  }, [LinearColors, scrollY]);
  const listHeader = useCreation(() => {
    return (
      <DetailHeader
        headerHeight={headerHeight}
        playInfo={playInfo}
        LinearColors={LinearColors}
        groupData={params}
      />
    );
  }, [playInfo, LinearColors]);
  const footer = useCreation(() => {
    const text = loading === false ? '无更多数据' : '加载中...';
    return <Text style={[styles.footer]}>{text}</Text>;
  }, [loading]);
  const renderItem = useMemoizedFn(
    ({item, index}: {item: songItemState; index: number}) => (
      <SongItem item={item} index={index + 1} moreClick={showAction} />
    ),
  );
  const onScroll = useMemoizedFn(
    ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {y} = nativeEvent.contentOffset;
      setscrollY(y);
    },
  );
  const listContainer = useCreation(() => {
    return (
      <FlatList
        ListHeaderComponent={listHeader}
        ListFooterComponent={footer}
        data={playInfo?.list}
        horizontal={false}
        renderItem={renderItem}
        onScroll={onScroll}
        keyExtractor={item => item.id}
      />
    );
  }, [playInfo, LinearColors]);

  return (
    <SafeAreaView style={[styles.container]}>
      {headContainer}
      {listContainer}
      <ActionSheet
        ref={actionRef}
        title={'歌曲信息'}
        options={['分享', '链接', '歌手', '取消']}
        cancelButtonIndex={3}
        destructiveButtonIndex={0}
        onPress={index => {
          if (index === 1) {
            actionItem?.current &&
              navigation.navigate({
                name: 'WebContext',
                params: {
                  url: getSongDetail(actionItem.current),
                  title: actionItem.current.name,
                },
                merge: true,
              });
          }
          actionItem.current = null;
        }}
      />
    </SafeAreaView>
  );
};
export default SongGroupDetail;
