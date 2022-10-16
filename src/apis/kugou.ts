import request from '@/utils/request';
import {
  JSONObject,
  playDetail,
  searchSongData,
  songChannel,
  songGroupData,
  songItemState,
} from '@/utils/types';
import {AxiosRequestConfig} from 'axios';
import moment from 'moment';

const requestKugou = (option: AxiosRequestConfig) => {
  return request<JSONObject>({
    ...option,
    headers: {
      referer: 'https://music.163.com/',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
  });
};
const getPlayListItem = (item: JSONObject) => {
  const url = `/app/i/getSongInfo.php?cmd=playInfo&hash=${item.hash}`;
  return new Promise((resolve, reject) => {
    requestKugou({
      method: 'GET',
      url,
      baseURL: baseUrl1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const baseUrl1 = 'https://m.kugou.com';
const baseUrl2 = 'http://songsearch.kugou.com';
// const baseUrl3 = 'http://www.kugou.com';

/**
 * (pageSize无效 只能30)
 * @param current 当前页
 * @param pageSize 每页n条
 * @returns
 */
export const getSongGroupListApi = (params?: {
  current?: number;
  pageSize?: number;
}): Promise<songGroupData> => {
  const {current = 1} = params || {};
  return new Promise((resolve, reject) => {
    requestKugou({
      url: '/plist/index',
      method: 'GET',
      baseURL: baseUrl1,
      params: {
        json: true,
        // pageSize: 30, //
        page: current,
      },
    })
      .then(res => {
        const data = res?.plist?.list || {};
        const list = data?.info || [];
        const result: songGroupData = {
          total: data.total,
          list: list.map((e: JSONObject) => ({
            updateTime: moment(e?.publishtime).format('YYYY-MM-dd'),
            createtime: moment(e?.publishtime).format('YYYY-MM-dd'),
            creator: {
              avatarUrl: e?.user_avatar,
              name: e?.username,
            },
            id: e?.specialid,
            name: e?.specialname,
            imageUrl: (e?.imgurl || '').replace('{size}', '400'),
            listenCount: e?.playcount, // 播放数量
            songChannel: 'kugou',
          })),
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
// 获取文件大小最大的文件hash
const getMaxSizeFileHash = (extra: {[name: string]: string | number} = {}) => {
  let max = 0;
  let keyStr = '';
  for (let key in extra) {
    const val = extra[key];
    if (typeof val === 'number' && val > max) {
      max = val;
      keyStr = key;
    }
  }
  const result = extra[keyStr.replace('filesize', 'hash')];
  return result + '';
};
// const getCoverImage = (FileHash: string): Promise<string> => {
//   return new Promise(resolve => {
//     requestKugou({
//       url: `/yy/index.php?r=play/getdata&hash=${FileHash}`,
//       method: 'GET',
//       baseURL: baseUrl3,
//     })
//       .then(data => {
//         resolve(data.img || '');
//       })
//       .catch(() => {
//         resolve('');
//       });
//   });
// };
const songItemCover = (song: JSONObject): songItemState => {
  const coverImage = song.album_img
    ? `${song.album_img.replace('{size}', '400')}`
    : '';
  const singer = Array.isArray(song.authors) ? song.authors : [];
  return {
    id: `kugou_${song.hash}`,
    albumId: song.album_id,
    coverImage,
    songId: getMaxSizeFileHash(song.extra),
    name: song.songName,
    isVip: false,
    singer: singer.map((s: JSONObject) => {
      return {
        id: s.author_id,
        name: s.author_name,
      };
    }),
    channel: 'kugou' as songChannel,
  };
};
// const getMinSizeFileHash = (extra: {[name: string]: string | number}) => {
//   let min = 0;
//   let keyStr = '';
//   for (let key in extra) {
//     const val = extra[key];
//     if (typeof val === 'number' && (val < min || min === 0)) {
//       min = val;
//       keyStr = key;
//     }
//   }
//   const result = extra[keyStr.replace('filesize', 'hash')];
//   console.log(result, keyStr, extra);
//   return result + '';
// };
export const getPlayDetailApi = (id: string): Promise<playDetail> => {
  return new Promise((resolve, reject) => {
    requestKugou({
      method: 'GET',
      url: `/plist/list/${id}?json=true`,
      baseURL: baseUrl1,
    })
      .then(async res => {
        const info = res?.info?.list || {};
        const list = res?.list?.list?.info || [];
        const tracks = await Promise.all(
          list.map(async (item: JSONObject) => await getPlayListItem(item)),
        );
        const hasListHash: string[] = [];
        const lists = tracks.filter(e => {
          const haveKey = hasListHash.indexOf(e.hash) === -1;
          if (haveKey) {
            hasListHash.push(e.hash);
          }
          return !!e.hash && haveKey;
        });
        const result: playDetail = {
          id: info.specialid,
          name: info.specialname,
          userName: info.nickname,
          desc: info.intro,
          userIcon: info.user_avatar,
          imageUrl: info.imgurl.replace('{size}', 400),
          tagList: info.tags.map((t: {tagname: string}) => {
            return {
              name: t.tagname,
            };
          }),
          list: lists.map(items => songItemCover(items)),
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
// 获取歌曲地址
export const getMusicUrlApi = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    requestKugou({
      method: 'GET',
      url: '/app/i/getSongInfo.php',
      baseURL: baseUrl1,
      params: {
        cmd: 'playInfo',
        hash: id,
      },
    })
      .then(async res => {
        resolve(res.url);
      })
      .catch(err => {
        reject(err);
      });
  });
};
//搜索 (pageSize无效 只能30)
export const searchApi = (params?: {
  current?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<searchSongData> => {
  console.log('kugouSearch');
  const {current = 1, keyword = ''} = params || {};
  return new Promise((resolve, reject) => {
    if (!keyword) {
      return resolve({
        total: 0,
        list: [],
      });
    }
    requestKugou({
      method: 'GET',
      url: '/song_search_v2',
      baseURL: baseUrl2,
      params: {
        keyword,
        page: current,
      },
    })
      .then(async ({data}) => {
        const tracks = await Promise.all(
          data.lists.map(async (item: JSONObject) => {
            item.hash = item.FileHash;
            return await getPlayListItem(item);
          }),
        );
        resolve({
          total: data.total,
          list:
            data.total === 0
              ? []
              : tracks.map((item: JSONObject) => {
                  return songItemCover(item);
                }),
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};
//当前渠道歌曲详情
export const songDetailApi = (song: songItemState) => {
  return `https://www.kugou.com/song/#hash=${song.id.replace(
    'kugou_',
    '',
  )}&album_id=${song?.albumId || ''}`;
};
