import {songGroupItem} from '@/utils/types';
import type {StackScreenProps} from '@react-navigation/stack';

//定义路由页面types
export type RootStackParamList = {
  Home: undefined;
  PlayerScreen: {id: string};
  SongGroupDetail: songGroupItem;
  WebContext: {url: string};
  SongGroupDesc: {id: string};
  NotFound: undefined;
  Search: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
