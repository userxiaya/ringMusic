import {AxiosRequestConfig} from 'axios';
import request from '@/utils/request';
import {playDetail, songGroupData, songItemState} from '@/utils/types';

const baseUrl1 = 'https://c.y.qq.com';
const baseUrl2 = 'https://u.y.qq.com';
const baseUrl3 = 'https://i.y.qq.com';

interface Tag {
  id: number;
  name: string;
  pid: number;
}

interface Pay {
  payalbum: number;
  payalbumprice: number;
  paydownload: number;
  payinfo: number;
  payplay: number;
  paytrackmouth: number;
  paytrackprice: number;
  timefree: number;
}

interface Preview {
  trybegin: number;
  tryend: number;
  trysize: number;
}

interface Singer {
  id: number;
  mid: string;
  name: string;
}

interface SonglistItem {
  albumdesc: string;
  albumid: number;
  albummid: string;
  albumname: string;
  alertid: number;
  belongCD: number;
  cdIdx: number;
  interval: number;
  isonly: number;
  label: string;
  msgid: number;
  pay: Pay;
  preview: Preview;
  rate: number;
  singer: Singer[];
  size128: number;
  size320: number;
  size5_1: number;
  sizeape: number;
  sizeflac: number;
  sizeogg: number;
  songid: number;
  songmid: string;
  songname: string;
  songorig: string;
  songtype: number;
  strMediaMid: string;
  stream: number;
  switch: number;
  type: number;
  vid: string;
}

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
const songItemCover = (items: SonglistItem): songItemState => {
  return {
    id: `QQ_${items.songid}`,
    songmid: items.songmid,
    songId: items.songmid,
    name: items.songname,
    isVip: items?.pay?.payplay === 1,
    coverImage: getImageUrl(items.albummid, 'album'),
    singer: items.singer.map((s: {id: number; name: string}) => {
      return {
        id: `${s.id}`,
        name: s.name,
      };
    }),
    channel: 'QQ',
  };
};
const requestQQ = <T>(option: AxiosRequestConfig) =>
  request<T>({
    ...option,
    headers: {
      Referer: 'https://y.qq.com/',
    },
  });
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
  const {current = 1, pageSize = 30} = params || {};
  const sin = (current - 1) * pageSize;
  const ein = current * pageSize - 1;
  interface listItem {
    dissid: string;
    createtime: string;
    commit_time: string;
    dissname: string;
    imgurl: string;
    introduction: string;
    listennum: number;
    score: number;
    version: number;
    creator: {
      type: number;
      qq: number;
      encrypt_uin: string;
      name: string;
      isVip: number;
      avatarUrl: string;
      followflag: number;
    };
  }
  //接口返回
  interface ResponseData {
    uin: number;
    categoryId: number;
    sortId: number;
    sum: number;
    sin: number;
    ein: number;
    list: listItem[];
  }
  return new Promise((resolve, reject) => {
    requestQQ<{data: ResponseData}>({
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
          list: data.list.map((e: listItem) => ({
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
  interface Cdlist {
    disstid: string;
    dir_show: number;
    owndir: number;
    dirid: number;
    coveradurl: string;
    dissid: number;
    login: string;
    uin: string;
    encrypt_uin: string;
    dissname: string;
    logo: string;
    pic_mid: string;
    album_pic_mid: string;
    pic_dpi: number;
    isAd: number;
    desc: string;
    ctime: number;
    mtime: number;
    headurl: string;
    ifpicurl: string;
    nick: string;
    nickname: string;
    type: number;
    singerid: number;
    singermid: string;
    isvip: number;
    isdj: number;
    tags: Tag[];
    songnum: number;
    songids: string;
    songtypes: string;
    disstype: number;
    dir_pic_url2: string;
    song_update_time: number;
    song_update_num: number;
    total_song_num: number;
    song_begin: number;
    cur_song_num: number;
    songlist: Array<SonglistItem>;
    visitnum: number;
    cmtnum: number;
    buynum: number;
    scoreavage: string;
    scoreusercount: number;
  }

  interface ResponseData {
    code: number;
    subcode: number;
    accessed_plaza_cache: number;
    accessed_favbase: number;
    login: string;
    cdnum: number;
    cdlist: Cdlist[];
    realcdnum: number;
  }
  return new Promise((resolve, reject) => {
    requestQQ<ResponseData>({
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
          tagList: data.tags.map(t => {
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
      .then((data: any) => {
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
