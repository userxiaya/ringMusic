import React from 'react';
import {
  useCreation,
  useInfiniteScroll,
  useMemoizedFn,
  useSetState,
} from 'ahooks';
import {
  ListRenderItemInfo,
  FlatList,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import {songChannel, songGroupData, songGroupItem} from '@/utils/types';
import {getSongGroupListApi as getSongGroupListQQApi} from '@/apis/qq';
import {getSongGroupListApi as getSongGroupListNetEaseApi} from '@/apis/netEase';
import {getSongGroupListApi as getSongGroupListNetKugouApi} from '@/apis/kugou';
import styleFn from './styles';
import {useNavigation} from '@react-navigation/native';
// import {useNavigation} from '@react-navigation/native';

const pageSize = 30;
const cols = 3;
const apiMap: {
  [name: string]: (params?: {
    current?: number;
    pageSize?: number;
  }) => Promise<songGroupData>;
} = {
  QQ: getSongGroupListQQApi,
  netEase: getSongGroupListNetEaseApi,
  kugou: getSongGroupListNetKugouApi,
};
const styles = styleFn(cols);
const fixCount = (count: number) => {
  if (count > 10000) {
    return `${Math.floor(count / 10000)}w+`;
  } else if (count > 1000) {
    return `${Math.floor(count / 1000)}k+`;
  } else {
    return 'num';
  }
};
interface State {
  curretPage: number;
  loading: boolean;
  noMore: boolean;
}
interface SongGroupProps {
  channel: songChannel;
}
const SongGroup = ({channel}: SongGroupProps) => {
  const navigation = useNavigation();
  const [state, setState] = useSetState<State>({
    curretPage: 0,
    loading: false,
    noMore: false,
  });
  let service = apiMap[channel];
  const {data, loadMore} = useInfiniteScroll(
    () => {
      return service({
        pageSize,
        current: state.curretPage + 1,
      });
    },
    {
      onBefore() {
        setState({
          loading: true,
        });
      },
      onSuccess: (res: songGroupData) => {
        const newCurrent = state.curretPage + 1;
        setState({
          curretPage: newCurrent,
          noMore: res.total / pageSize <= newCurrent,
        });
      },
      onFinally() {
        setState({
          loading: false,
        });
      },
    },
  );
  const onLoadMore = useMemoizedFn(() => {
    if (state.loading === false && state.noMore === false) {
      loadMore();
    }
  });
  const gotToDetail = useMemoizedFn((item: songGroupItem) => {
    navigation.navigate('SongGroupDetail', item);
  });
  const renderItem = useMemoizedFn(
    ({item}: ListRenderItemInfo<songGroupItem>) => {
      return (
        <TouchableHighlight
          underlayColor="#DDDDDD"
          onPress={() => gotToDetail(item)}>
          <View style={[styles.items]}>
            <View style={[styles.listen]}>
              <Text style={[styles.listen_text]}>
                {fixCount(item.listenCount)}
              </Text>
              <View style={[styles.listen_icon_content]}>
                <Image
                  style={[styles.listen_icon]}
                  source={require('@/assets/image/listen.png')}
                />
              </View>
            </View>
            <Image
              style={[styles.image]}
              //android debug环境不生效
              defaultSource={require('@/assets/image/default.png')}
              source={{
                uri: item.imageUrl,
              }}
            />
            <Text numberOfLines={2} style={[styles.message]}>
              {item.name}
            </Text>
          </View>
        </TouchableHighlight>
      );
    },
  );
  const footer = useCreation(() => {
    const text = state.noMore === true ? '无更多数据' : '加载中...';
    return <Text style={[styles.footer]}>{text}</Text>;
  }, [state]);
  return (
    <FlatList
      ListFooterComponent={footer}
      style={[styles.list]}
      data={data?.list}
      onEndReachedThreshold={0.2}
      onEndReached={onLoadMore}
      horizontal={false}
      numColumns={3}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};
export default SongGroup;
