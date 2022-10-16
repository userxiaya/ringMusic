import {NativeModules, ToastAndroid} from 'react-native';
import {songItemState} from './types';
import {
  getMusicUrlApi as qqMusicUrlApi,
  songDetailApi as qqSongDetailApi,
} from '@/apis/qq';
import {
  getMusicUrlApi as netEaseMusicUrlApi,
  songDetailApi as netEaseSongDetailApi,
} from '@/apis/netEase';
import {
  getMusicUrlApi as kugouMusicUrlApi,
  songDetailApi as kugouSongDetailApi,
} from '@/apis/kugou';
import TrackPlayer from 'react-native-track-player';
//toast提示
export const showToast = (text: string) => {
  ToastAndroid.show(text, ToastAndroid.SHORT);
};
export const addSong = (song: songItemState) => {
  const apiMap: {
    [name: string]: (id: string) => Promise<string>;
  } = {
    QQ: qqMusicUrlApi,
    netEase: netEaseMusicUrlApi,
    kugou: kugouMusicUrlApi,
  };
  const service = apiMap[song.channel];
  service(song.songId)
    .then(async songUrl => {
      const ids = song.id;
      if (!songUrl) {
        showToast('获取播放路径失败！请切换渠道');
        return;
      }
      const queue = await TrackPlayer.getQueue();
      let hasSongIndex = -1;
      queue.forEach((s, index) => {
        if (s.id === ids) {
          hasSongIndex = index;
        }
      });
      console.log('hasSongIndex', hasSongIndex);

      if (hasSongIndex === -1) {
        await TrackPlayer.add({
          id: ids,
          url: songUrl, // Load media from the network
          title: song.name,
          artist: song.singer.map(e => e.name).join('/'),
          artwork: song.coverImage, // Load artwork from the network
        });
        const index = queue.length;
        console.log('SongIndex', index);
        await TrackPlayer.skip(index);
        TrackPlayer.play();
      } else {
        await TrackPlayer.skip(hasSongIndex);
        TrackPlayer.play();
      }
    })
    .catch(() => {
      showToast('获取播放路径失败！请切换渠道');
    });
};
export const getSongDetail = (song: songItemState) => {
  const apiMap: {
    [name: string]: (song: songItemState) => string;
  } = {
    QQ: qqSongDetailApi,
    netEase: netEaseSongDetailApi,
    kugou: kugouSongDetailApi,
  };
  const service = apiMap[song.channel];
  return service(song);
};
export const previousSong = async () => {
  //原生的上一曲有bug 偶发返回不了 顶不住自己写
  const index = await TrackPlayer.getCurrentTrack(); //当前播放的曲子index
  const queue = await TrackPlayer.getQueue(); //队列
  const currentIndex = index !== null ? index : 0;
  const prevIndex = currentIndex - 1;
  TrackPlayer.skip(prevIndex < 0 ? queue.length - 1 : prevIndex);
  TrackPlayer.play();
};
export const nextSong = async () => {
  TrackPlayer.skipToNext();
  TrackPlayer.play();
};
export default NativeModules.appTools;
