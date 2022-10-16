import Header from '@/components/header';
import appTools from '@/utils/appTools';
import {playDetail, songGroupItem} from '@/utils/types';
import {useCreation, useRequest, useSafeState} from 'ahooks';
import React, {useEffect} from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';
import {getPlayDetailApi as qqDetail} from '@/apis/qq';
import {getPlayDetailApi as netEaseDetail} from '@/apis/netEase';
import {getPlayDetailApi as kugouDetail} from '@/apis/kugou';
import styles from './style';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import style from './style';
const apiMap: {
  [name: string]: (id: string) => Promise<playDetail>;
} = {
  QQ: qqDetail,
  netEase: netEaseDetail,
  kugou: kugouDetail,
};
const SongGroupDesc = () => {
  const route = useRoute();
  const params = useCreation(() => {
    const result = route.params as songGroupItem;
    return result;
  }, [route.params]);
  const [imageBackground, setBackground] = useSafeState<{
    startColor: string;
    endColor: string;
  } | null>(null);
  const {songChannel, id} = params;
  const service = apiMap[songChannel];
  const {data: playInfo} = useRequest(
    () => service?.(id) as Promise<playDetail>,
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
  const headContainer = useCreation(() => {
    return <Header color={'#fff'} />;
  }, []);

  const Desc = useCreation(() => {
    const source = {
      html: `<p style="color:#fff;font-size:15px;line-height:23px">${playInfo?.desc}</p>`,
    };
    return (
      <View style={styles.desc}>
        <Text style={styles.userName}>{playInfo?.userName}</Text>
        <View style={styles.tagContainer}>
          {playInfo?.tagList.map(tag => (
            <Text style={[styles.tag]}>{tag.name}</Text>
          ))}
        </View>
        <RenderHtml contentWidth={0} source={source} />
      </View>
    );
  }, [playInfo]);

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
  return (
    <SafeAreaView style={[styles.container]}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={LinearColors}
        style={[styles.container]}>
        {headContainer}
        <View style={style.iconContainer}>
          <Image
            style={styles.icon}
            source={{uri: playInfo?.imageUrl}}
            resizeMode="cover"
          />
        </View>
        {Desc}
      </LinearGradient>
    </SafeAreaView>
  );
};
export default SongGroupDesc;
