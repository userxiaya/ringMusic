import React, {useCallback, useRef} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text} from 'react-native';
import SearchBar from '@/components/searchBar';
import ActionSheet from 'react-native-actionsheet';
import {
  useCreation,
  useDebounce,
  useInfiniteScroll,
  useMemoizedFn,
  useSetState,
  useUpdateEffect,
} from 'ahooks';
import {searchApi as searchQQApi} from '@/apis/qq';
import {searchApi as searchNetEaseApi} from '@/apis/netEase';
import {searchApi as searchKugouApi} from '@/apis/kugou';
import {searchSongData, songChannel, songItemState} from '@/utils/types';
import SongItem from '@/components/songItem';
import {WhiteSpace} from '@ant-design/react-native';
import {footer} from '@/themeStyle';
import {uniqBy} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {getSongDetail} from '@/utils/appTools';
interface searchParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
}
const serviceMap: {
  [name: string]: (params?: searchParams) => Promise<searchSongData>;
} = {
  QQ: searchQQApi,
  netEase: searchNetEaseApi,
  kugou: searchKugouApi,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: footer.style,
});
const pageSize = 30;
interface State {
  keyword?: string;
  channel: songChannel;
}
interface StateList {
  current: number;
  loading: boolean;
  noMore: boolean;
  reloading: boolean;
}
interface ListContainerProps {
  keyword?: string;
  channel: songChannel;
}
function ListContainer(props: ListContainerProps) {
  const actionRef = useRef<any>(null);
  const actionItem = useRef<songItemState | null>(null);
  const showAction = useMemoizedFn((item: songItemState) => {
    actionItem.current = item;
    actionRef.current?.show();
  });
  const [state, setState] = useSetState<StateList>({
    current: 0,
    loading: false,
    noMore: false,
    reloading: false,
  });
  const navigation = useNavigation();
  const searchText = useDebounce(props.keyword, {wait: 500});
  //监听channel改变 生成新的请求方法
  const searchService = useCallback(
    (params?: searchParams) => {
      return serviceMap[props?.channel](params);
    },
    [props.channel],
  );
  const {data, loadMore, reload} = useInfiniteScroll(
    () => {
      const params = {
        pageSize,
        current: state.current + 1,
        keyword: props.keyword,
      };
      return searchService(params);
    },
    {
      manual: true,
      onBefore() {
        setState({
          loading: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-shadow
      onSuccess: (data: any) => {
        const newCurrent = state.current + 1;
        setState({
          loading: false,
          current: newCurrent,
          noMore: data.total / pageSize <= newCurrent,
          reloading: false,
        });
      },
      onFinally() {
        setState({
          loading: false,
          reloading: false,
        });
      },
    },
  );
  useUpdateEffect(() => {
    setState({
      current: 0,
      noMore: false,
      reloading: true,
    });
    setTimeout(() => {
      reload();
    }, 0);
  }, [searchText, searchService]);
  const onLoadMore = useMemoizedFn(() => {
    if (state.loading === false && state.noMore === false) {
      loadMore();
    }
  });
  const renderItem = useMemoizedFn(
    ({item, index}: {item: songItemState; index: number}) => {
      return <SongItem item={item} index={index + 1} moreClick={showAction} />;
    },
  );
  const listFooter = useCreation(() => {
    const text =
      state.noMore === true || !props.keyword ? '无更多数据' : '加载中...';
    return <Text style={[styles.footer]}>{text}</Text>;
  }, [state, props.channel, props.keyword]);
  const array = state.reloading ? [] : uniqBy(data?.list || [], 'id');
  return (
    <>
      <WhiteSpace size="sm" />
      <FlatList
        data={array}
        onEndReachedThreshold={0.2}
        onEndReached={onLoadMore}
        horizontal={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={listFooter}
      />
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
    </>
  );
}
function SearchPage() {
  const [state, setState] = useSetState<State>({
    keyword: undefined,
    channel: 'QQ',
  });
  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={state.keyword}
        onChange={text => {
          setState({
            keyword: text,
          });
        }}
        channel={state.channel}
        onChannelChange={val => {
          setState({
            channel: val,
          });
        }}
      />
      <ListContainer keyword={state.keyword} channel={state.channel} />
    </SafeAreaView>
  );
}
export default SearchPage;
