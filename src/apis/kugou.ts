import request from '@/utils/request';
import {
  JSONObject,
  playDetail,
  songChannel,
  songGroupData,
  songItemState,
} from '@/utils/types';
import {AxiosRequestConfig} from 'axios';
import moment from 'moment';

const baseUrl1 = 'https://m.kugou.com';

const requestKugou = <T>(option: AxiosRequestConfig) => {
  return request<T>({
    ...option,
    headers: {
      referer: 'https://music.163.com/',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
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
const songItemCover = (song: any): songItemState => {
  const coverImage = song.album_img
    ? `${song.album_img.replace('{size}', '400')}`
    : '';
  const singer = Array.isArray(song.authors) ? song.authors : [];
  return {
    id: `kugou_${song.hash}`,
    coverImage,
    songId: getMaxSizeFileHash(song.extra),
    name: song.songName,
    isVip: false,
    singer: singer.map((s: {author_id: number; author_name: any}) => {
      return {
        id: s.author_id,
        name: s.author_name,
      };
    }),
    channel: 'kugou' as songChannel,
  };
};
const getPlayListItem = (item: {hash: string}) => {
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
  interface Qualitymap {
    attr0: number;
  }
  interface Classmap {
    attr0: number;
  }
  interface Trans_param {
    cpy_grade: number;
    qualitymap: Qualitymap;
    display_rate: number;
    free_for_ad: number;
    cid: number;
    classmap: Classmap;
    cpy_attr0: number;
    hash_multitrack: string;
    pay_block_tpl: number;
    musicpack_advance: number;
    display: number;
    cpy_level: number;
  }
  interface Song {
    hash: string;
    sqfilesize: number;
    sqprivilege: number;
    pay_type_sq: number;
    bitrate: number;
    pkg_price_sq: number;
    has_accompany: number;
    topic_url_320: string;
    sqhash: string;
    fail_process: number;
    pay_type: number;
    rp_type: string;
    album_id: string;
    mvhash: string;
    duration: number;
    topic_url_sq: string;
    '320hash': string;
    price_sq: number;
    inlist: number;
    m4afilesize: number;
    old_cpy: number;
    '320filesize': number;
    pkg_price_320: number;
    price_320: number;
    feetype: number;
    price: number;
    filename: string;
    extname: string;
    pkg_price: number;
    fail_process_320: number;
    trans_param: Trans_param;
    remark: string;
    filesize: number;
    album_audio_id: number;
    brief: string;
    rp_publish: number;
    privilege: number;
    topic_url: string;
    audio_id: number;
    '320privilege': number;
    pay_type_320: number;
    fail_process_sq: number;
  }
  interface Trans_param {
    special_tag: number;
  }
  interface Info {
    specialid: number;
    playcount: number;
    songcount: number;
    publishtime: string;
    songs: Song[];
    suid: number;
    url: string;
    type: number;
    slid: number;
    verified: number;
    global_specialid: string;
    selected_reason: string;
    tags: any[];
    collectcount: number;
    trans_param: Trans_param;
    user_type: number;
    username: string;
    singername: string;
    percount: number;
    recommendfirst: number;
    ugc_talent_review: number;
    specialname: string;
    user_avatar: string;
    is_selected: number;
    intro: string;
    imgurl: string;
    encode_id: string;
    play_count_text: string;
  }
  interface List {
    timestamp: number;
    total: number;
    info: Info[];
    has_next: number;
  }
  interface Plist {
    list: List;
    pagesize: number;
  }
  interface ResponseData {
    jS_CSS_DATE: number;
    kg_domain: string;
    src: string;
    fr?: any;
    ver: string;
    plist: Plist;
    pagesize: number;
    __Tpl: string;
  }
  return new Promise((resolve, reject) => {
    requestKugou<ResponseData>({
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
          list: list.map(info => ({
            updateTime: moment(info?.publishtime).format('YYYY-MM-dd'),
            createtime: moment(info?.publishtime).format('YYYY-MM-dd'),
            creator: {
              avatarUrl: info?.user_avatar,
              name: info.username,
            },
            id: `${info?.specialid}`,
            name: info?.specialname,
            imageUrl: (info?.imgurl || '').replace('{size}', '400'),
            listenCount: info?.playcount, // 播放数量
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
export const getPlayDetailApi = (id: string): Promise<playDetail> => {
  return new Promise((resolve, reject) => {
    requestKugou<JSONObject>({
      method: 'GET',
      url: `/plist/list/${id}?json=true`,
      baseURL: baseUrl1,
    })
      .then(async res => {
        const info = res?.info?.list || {};
        const list = res?.list?.list?.info || [];
        const tracks = await Promise.all(
          list.map(async (item: any) => await getPlayListItem(item)),
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
      .then(async (res: any) => {
        resolve(res.url);
      })
      .catch(err => {
        reject(err);
      });
  });
};
