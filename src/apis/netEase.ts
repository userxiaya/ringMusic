import {AxiosRequestConfig} from 'axios';
import request from '@/utils/request';
import queryString from 'query-string';
import {weapi} from '@/utils/cypto';
import moment from 'moment';
import {playDetail, songGroupData, songItemState} from '@/utils/types';

const baseUrl1: string = 'https://music.163.com';

interface AvatarDetail {
  userType: number;
  identityLevel: number;
  identityIconUrl: string;
}

interface Creator {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags?: any;
  experts?: any;
  djStatus: number;
  vipType: number;
  remarkName?: any;
  authenticationTypes: number;
  avatarDetail: AvatarDetail;
  anchor: boolean;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
  avatarImgId_str: string;
}

interface Ar {
  id: number;
  name: string;
  tns: any[];
  alias: any[];
}

interface Al {
  id: number;
  name: string;
  picUrl: string;
  tns: any[];
  pic_str: string;
  pic: number;
}

interface H {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

interface M {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

interface L {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

interface Sq {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

interface Hr {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr: number;
}

interface Track {
  name: string;
  id: number;
  pst: number;
  t: number;
  ar: Ar[];
  alia?: any[];
  pop: number;
  st: number;
  rt: string;
  fee: number;
  v: number;
  crbt?: any;
  cf: string;
  al: Al;
  dt: number;
  h: H;
  m: M;
  l: L;
  sq: Sq;
  hr: Hr;
  a?: any;
  cd: string;
  no: number;
  rtUrl?: any;
  ftype: number;
  rtUrls: any[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData?: any;
  tagPicList?: any;
  resourceState: boolean;
  version: number;
  songJumpInfo?: any;
  entertainmentTags?: any;
  single: number;
  noCopyrightRcmd?: any;
  rurl?: any;
  rtype: number;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
  alg: string;
}

interface TrackId {
  id: number;
  v: number;
  t: number;
  at: number;
  alg: string;
  uid: number;
  rcmdReason: string;
  sc?: any;
}

interface Playlist {
  id: number;
  name: string;
  coverImgId: number;
  coverImgUrl: string;
  coverImgId_str: string;
  adType: number;
  userId: number;
  createTime: number;
  status: number;
  opRecommend: boolean;
  highQuality: boolean;
  newImported: boolean;
  updateTime: number;
  trackCount: number;
  specialType: number;
  privacy: number;
  trackUpdateTime: number;
  commentThreadId: string;
  playCount: number;
  trackNumberUpdateTime: number;
  subscribedCount: number;
  cloudTrackCount: number;
  ordered: boolean;
  description: string;
  tags: string[];
  updateFrequency: string;
  backgroundCoverId: number;
  backgroundCoverUrl: string;
  titleImage: number;
  titleImageUrl: string;
  englishTitle: string;
  officialPlaylistType: string;
  copied: boolean;
  subscribers: any[];
  subscribed?: any;
  creator: Creator;
  tracks: Track[];
  videoIds?: any;
  videos?: any;
  trackIds: TrackId[];
  bannedTrackIds?: any;
  shareCount: number;
  commentCount: number;
  remixVideo?: any;
  sharedUsers?: any;
  historySharedUsers?: any;
  gradeStatus: string;
  score?: any;
  algTags?: any;
}

interface FreeTrialPrivilege {
  resConsumable: boolean;
  userConsumable: boolean;
  listenType?: any;
}

interface ChargeInfoList {
  rate: number;
  chargeUrl?: any;
  chargeMessage?: any;
  chargeType: number;
}
interface Song {
  name: string;
  id: number;
  pst: number;
  t: number;
  ar: Ar[];
  alia?: any[];
  pop: number;
  st: number;
  rt: string;
  fee: number;
  v: number;
  crbt?: any;
  cf: string;
  al: Al;
  dt: number;
  h: H;
  m: M;
  l: L;
  sq: Sq;
  hr: Hr;
  a?: any;
  cd: string;
  no: number;
  rtUrl?: any;
  ftype: number;
  rtUrls: any[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData?: any;
  tagPicList?: any;
  resourceState: boolean;
  version: number;
  songJumpInfo?: any;
  entertainmentTags?: any;
  awardTags?: any;
  single: number;
  noCopyrightRcmd?: any;
  rtype: number;
  rurl?: any;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
}
interface Privilege {
  id: number;
  fee: number;
  payed: number;
  realPayed: number;
  st: number;
  pl: number;
  dl: number;
  sp: number;
  cp: number;
  subp: number;
  cs: boolean;
  maxbr: number;
  fl: number;
  pc?: any;
  toast: boolean;
  flag: number;
  paidBigBang: boolean;
  preSell: boolean;
  playMaxbr: number;
  downloadMaxbr: number;
  maxBrLevel: string;
  playMaxBrLevel: string;
  downloadMaxBrLevel: string;
  plLevel: string;
  dlLevel: string;
  flLevel: string;
  rscl?: any;
  freeTrialPrivilege: FreeTrialPrivilege;
  chargeInfoList: ChargeInfoList[];
}

const requestNetEase = <T>(option: AxiosRequestConfig) => {
  return request<T>({
    ...option,
    data: queryString.stringify(weapi(option.data)),
    headers: {
      referer: 'https://music.163.com/',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Linux; U; Android 8.1.0; zh-cn; BLA-AL00 Build/HUAWEIBLA-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.132 MQQBrowser/8.9 Mobile Safari/537.36',
    },
  });
};
const songItemCover = (items: Song): songItemState => ({
  id: `netEase_${items.id}`,
  songId: `${items.id}`,
  name: items.name,
  isVip: false,
  coverImage: items.al.picUrl,
  singer: items.ar.map((e: {id: number; name: string}) => ({
    id: `${e.id}`,
    name: e.name,
  })),
  channel: 'netEase',
});
const querySongList = (trackIds: number[]): Promise<songItemState[]> => {
  return new Promise((resolve, reject) => {
    const data = {
      c: '[' + trackIds.map(id => '{"id":' + id + '}').join(',') + ']',
      ids: '[' + trackIds.join(',') + ']',
    };
    interface ResponseData {
      songs: Song[];
      privileges: Privilege[];
      code: number;
    }
    requestNetEase<ResponseData>({
      url: '/weapi/v3/song/detail',
      method: 'POST',
      baseURL: baseUrl1,
      data,
    })
      .then(res => {
        const list: Song[] = res?.songs || [];
        const result: songItemState[] = list.map(songItemCover);
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};
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
  const data = {
    cat: '全部',
    order: 'hot', // hot,new
    limit: pageSize,
    offset: (current - 1) * pageSize,
    total: true,
  };
  return new Promise((resolve, reject) => {
    // 返回数据ts格式 start
    // interface AvatarDetail {
    //   userType: number;
    //   identityLevel: number;
    //   identityIconUrl: string;
    // }
    // interface Creator {
    //   defaultAvatar: boolean;
    //   province: number;
    //   authStatus: number;
    //   followed: boolean;
    //   avatarUrl: string;
    //   accountStatus: number;
    //   gender: number;
    //   city: number;
    //   birthday: number;
    //   userId: number;
    //   userType: number;
    //   nickname: string;
    //   signature: string;
    //   description: string;
    //   detailDescription: string;
    //   avatarImgId: number;
    //   backgroundImgId: number;
    //   backgroundUrl: string;
    //   authority: number;
    //   mutual: boolean;
    //   expertTags?: any;
    //   experts?: any;
    //   djStatus: number;
    //   vipType: number;
    //   remarkName?: any;
    //   authenticationTypes: number;
    //   avatarDetail: AvatarDetail;
    //   anchor: boolean;
    //   avatarImgIdStr: string;
    //   backgroundImgIdStr: string;
    //   avatarImgId_str: string;
    // }
    // interface Subscriber {
    //   defaultAvatar: boolean;
    //   province: number;
    //   authStatus: number;
    //   followed: boolean;
    //   avatarUrl: string;
    //   accountStatus: number;
    //   gender: number;
    //   city: number;
    //   birthday: number;
    //   userId: number;
    //   userType: number;
    //   nickname: string;
    //   signature: string;
    //   description: string;
    //   detailDescription: string;
    //   avatarImgId: number;
    //   backgroundImgId: number;
    //   backgroundUrl: string;
    //   authority: number;
    //   mutual: boolean;
    //   expertTags?: any;
    //   experts?: any;
    //   djStatus: number;
    //   vipType: number;
    //   remarkName?: any;
    //   authenticationTypes: number;
    //   avatarDetail?: any;
    //   anchor: boolean;
    //   avatarImgIdStr: string;
    //   backgroundImgIdStr: string;
    //   avatarImgId_str: string;
    // }
    // interface Playlist {
    //   name: string;
    //   id: number;
    //   trackNumberUpdateTime: number;
    //   status: number;
    //   userId: number;
    //   createTime: number;
    //   updateTime: number;
    //   subscribedCount: number;
    //   trackCount: number;
    //   cloudTrackCount: number;
    //   coverImgUrl: string;
    //   coverImgId: number;
    //   description: string;
    //   tags: string[];
    //   playCount: number;
    //   trackUpdateTime: number;
    //   specialType: number;
    //   totalDuration: number;
    //   creator: Creator;
    //   tracks?: any;
    //   subscribers: Subscriber[];
    //   subscribed?: any;
    //   commentThreadId: string;
    //   newImported: boolean;
    //   adType: number;
    //   highQuality: boolean;
    //   privacy: number;
    //   ordered: boolean;
    //   anonimous: boolean;
    //   coverStatus: number;
    //   recommendInfo?: any;
    //   shareCount: number;
    //   coverImgId_str: string;
    //   alg: string;
    //   commentCount: number;
    // }
    interface ResponseData {
      playlists: Playlist[];
      total: number;
      code: number;
      more: boolean;
      cat: string;
    }
    // 返回数据ts格式 end
    requestNetEase<ResponseData>({
      url: '/weapi/playlist/list',
      method: 'POST',
      baseURL: baseUrl1,
      data,
    })
      .then(res => {
        const result: songGroupData = {
          total: res.total,
          list: res.playlists.map((items: any) => ({
            updateTime: moment(items?.updateTime).format('YYYY-MM-dd'),
            createtime: moment(items?.createTime).format('YYYY-MM-dd'),
            creator: {
              avatarUrl: items?.creator?.avatarUrl,
              name: items?.creator?.name,
            },
            id: items?.id,
            name: items?.name,
            imageUrl: items?.coverImgUrl,
            listenCount: items?.playCount, // 播放数量
            songChannel: 'netEase',
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
    const params = {
      id: id,
      offset: 0,
      total: true,
      limit: 1000,
      n: 1000,
      csrf_token: '',
    };
    interface ResponseData {
      code: number;
      relatedVideos?: any;
      playlist: Playlist;
      urls?: any;
      privileges: Privilege[];
      sharedPrivilege?: any;
      resEntrance?: any;
    }
    requestNetEase<ResponseData>({
      url: '/weapi/v3/playlist/detail',
      method: 'POST',
      baseURL: baseUrl1,
      data: params,
    })
      .then(async res => {
        const data = res.playlist || {};
        const getListPromise = [];
        const count = 100;
        const list = data.trackIds.map((e: {id: number}) => e.id);
        for (let i = 0; i < list.length; i += count) {
          const trackIds = list.slice(i, i + count);
          getListPromise.push(querySongList(trackIds));
        }
        // 拆分查询 （查询数据过大报错）
        const songListResult = await Promise.all(getListPromise);
        let songList: songItemState[] = [];
        songListResult.forEach(lists => {
          songList = [...songList, ...lists];
        });
        const result: playDetail = {
          id: `${data.id}`,
          userName: data.creator.nickname,
          desc: data.description,
          userIcon: data.creator.avatarUrl,
          imageUrl: data.coverImgUrl,
          name: data.name,
          tagList: data.tags.map((name: any) => {
            return {
              name,
            };
          }),
          list: songList,
        };
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getMusicUrlApi = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const data = {
      ids: [id],
      level: 'standard',
      encodeType: 'aac',
      csrf_token: '',
    };
    requestNetEase({
      url: '/weapi/song/enhance/player/url/v1?csrf_token=',
      method: 'POST',
      baseURL: baseUrl1,
      data,
    })
      .then(async (res: any) => {
        const {url: songUrl} = res.data[0];
        if (songUrl === null) {
          return resolve('');
        }
        resolve(songUrl);
      })
      .catch(err => {
        reject(err);
      });
  });
};
