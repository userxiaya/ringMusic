import request from '@/utils/request';
import {
  JSONObject,
  playDetail,
  searchSongData,
  songGroupData,
  songItemState,
} from '@/utils/types';
import {AxiosRequestConfig} from 'axios';

function getImageUrl(qqimgid: string, imgType: 'artist' | 'album') {
  if (qqimgid == null) {
    return '';
  }
  let category = '';
  if (imgType === 'artist') {
    category = 'T001R300x300M000';
  }
  if (imgType === 'album') {
    category = 'T002R300x300M000';
  }
  const s = category + qqimgid;
  const url = `https://y.gtimg.cn/music/photo_new/${s}.jpg`;
  return url;
}
const requestQQ = (option: AxiosRequestConfig) => {
  return request<JSONObject>({
    ...option,
    headers: {
      Referer: 'https://y.qq.com/',
    },
  });
};
const songItemCover = (items: JSONObject): songItemState => {
  return {
    id: `QQ_${items.songid}`,
    songmid: items.songmid,
    songId: items.songmid,
    name: items.songname,
    isVip: items?.pay?.payplay === 1,
    coverImage: getImageUrl(items.albummid, 'album'),
    singer: items.singer.map((s: {id: number; name: string}) => {
      return {
        id: s.id,
        name: s.name,
      };
    }),
    channel: 'QQ',
  };
};
const baseUrl1 = 'https://c.y.qq.com';
const baseUrl2 = 'https://u.y.qq.com';
const baseUrl3 = 'https://i.y.qq.com';
/**
 *
 * @param current 当前页
 * @param pageSize 每页n条
 * @returns
 */
export const getSongGroupListApi = (params?: {
  current?: number;
  pageSize?: number;
}): Promise<songGroupData> => {
  const {current = 1, pageSize = 10} = params || {};
  const sin = (current - 1) * pageSize;
  const ein = current * pageSize - 1;
  return new Promise((resolve, reject) => {
    requestQQ({
      baseURL: baseUrl1,
      url: '/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
      method: 'GET',
      params: {
        picmid: 1,
        rnd: Math.random(),
        g_tk: 732560869,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        categoryId: 10000000, // 歌单类型Id
        sortId: 5,
        sin,
        ein,
      },
    })
      .then(({data}) => {
        const result: songGroupData = {
          total: data.sum,
          list: data.list.map((e: JSONObject) => ({
            updateTime: e?.commit_time,
            createtime: e?.createtime,
            creator: {
              avatarUrl: e?.creator?.avatarUrl,
              name: e?.creator?.name,
            },
            id: e?.dissid,
            name: e?.dissname,
            imageUrl: e?.imgurl,
            songChannel: 'QQ',
            listenCount: e?.listennum, // 播放数量
          })),
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
//获取歌单详情
export const getPlayDetailApi = (id: string): Promise<playDetail> => {
  return new Promise((resolve, reject) => {
    requestQQ({
      url: '/qzone-music/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
      method: 'GET',
      baseURL: baseUrl3,
      params: {
        disstid: id,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        nosign: 1,
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'GB2312',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
      },
    })
      .then(res => {
        const data = res?.cdlist?.[0] || {};
        const result: playDetail = {
          id: data.disstid,
          userName: data.nickname,
          desc: data.desc,
          userIcon: data.headurl,
          imageUrl: data.logo,
          name: data.dissname,
          tagList: data.tags.map((t: JSONObject) => {
            return {
              name: t.name,
            };
          }),
          list: data.songlist.map(songItemCover),
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
    requestQQ({
      url: '/cgi-bin/musicu.fcg',
      method: 'GET',
      baseURL: baseUrl2,
      params: {
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        data: {
          req_0: {
            module: 'vkey.GetVkeyServer',
            method: 'CgiGetVkey',
            param: {
              guid: '10000',
              songmid: [id],
              songtype: [0],
              uin: '0',
              loginflag: 1,
              platform: '20',
            },
          },
          comm: {uin: 0, format: 'json', ct: 20, cv: 0},
        },
      },
    })
      .then(data => {
        if (data.req_0.data.midurlinfo[0].purl === '') {
          return resolve('');
        }
        const url = data.req_0.data.sip[0] + data.req_0.data.midurlinfo[0].purl;
        resolve(url);
      })
      .catch(err => {
        reject(err);
      });
  });
};
//搜索
export const searchApi = (params?: {
  current?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<searchSongData> => {
  console.log('QQSearch');
  const {current = 1, pageSize = 30, keyword = ''} = params || {};
  return new Promise((resolve, reject) => {
    if (!keyword) {
      resolve({
        total: 0,
        list: [],
      });
      return;
    }
    requestQQ({
      url: '/soso/fcgi-bin/client_search_cp',
      method: 'GET',
      baseURL: baseUrl1,
      params: {
        g_tk: '938407465',
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: keyword,
        zhidaqu: 1,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: pageSize,
        n: pageSize,
        p: current,
        remoteplace: 'txt.mqq.all',
        _: 1459991037831,
      },
    })
      .then(({data}) => {
        const {song = {}} = data;
        resolve({
          total: song.totalnum || 0,
          list: (song.list || []).map(songItemCover),
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};
