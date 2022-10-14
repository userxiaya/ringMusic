import {songGroupItem} from '@/utils/types';
import type {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  PlayerScreen: {id: string};
  SongGroupDetail: songGroupItem;
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
