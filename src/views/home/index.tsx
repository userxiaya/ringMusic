import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from '@/components/header';
import Icon from '@/components/icon';
import {ThemeContext} from '@/store/theme';
import {Tabs} from '@ant-design/react-native';
import {useNavigation} from '@react-navigation/native';
import SongGroup from '@/components/SongGroup';
import {useMemoizedFn} from 'ahooks';
import {TabBarPropsType} from '@ant-design/react-native/lib/tabs/PropsType';
import {songChannel} from '@/utils/types';
import eventBus from '@/utils/bus';

const AntdTabs = Tabs as any;
const styles = StyleSheet.create({
  iconList: {
    height: '100%',
    width: '20%',
    textAlignVertical: 'center',
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tab_content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  tab_container: {
    backgroundColor: '#fff',
    flex: 2,
    borderBottomWidth: 0,
  },
  tab_bar_content: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  tab_bar_item: {
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Home = () => {
  const tabs: Array<{
    title: string;
    channel: songChannel;
  }> = [
    {title: 'QQ', channel: 'QQ'},
    {title: '网易云', channel: 'netEase'},
    {title: '酷狗', channel: 'kugou'},
  ];
  const navigation = useNavigation();
  const {state: theme} = useContext(ThemeContext);
  const searchIcon: React.ReactNode = (
    <Icon
      name="icon-search"
      size={24}
      color={theme?.text_color}
      onPress={() => {
        navigation.navigate('Search');
      }}
    />
  );
  const indexIcon: React.ReactNode = (
    <Icon
      name="icon-list"
      size={24}
      color={theme?.text_color}
      style={styles.iconList}
      onPress={() => {
        eventBus.emit('openDrawer');
      }}
    />
  );

  const activeTab = useMemoizedFn((active: boolean) => {
    const result = StyleSheet.create({
      class: {
        borderBottomColor: active ? theme?.text_color : '',
        borderBottomWidth: active ? 2 : 0,
      },
    });
    return result;
  });
  const tabBarRender = useMemoizedFn((tabProps: TabBarPropsType) => {
    return (
      <View style={[styles.tab_bar_content]}>
        {tabProps.tabs.map((tab, i) => {
          const activeTextClass = StyleSheet.create({
            class: {
              color: tabProps.activeTab === i ? theme?.text_color : '#66666E',
            },
          });
          return (
            // change the style to fit your needs
            <TouchableOpacity
              style={[
                styles.tab_bar_item,
                activeTab(tabProps.activeTab === i).class,
              ]}
              activeOpacity={0.9}
              key={tab.key || i}
              onPress={() => {
                const {goToTab, onTabClick} = tabProps;
                // tslint:disable-next-line:no-unused-expression
                onTabClick && onTabClick(tabs[i], i);
                // tslint:disable-next-line:no-unused-expression
                goToTab && goToTab(i);
              }}>
              <Text style={[activeTextClass?.class]}>{tab.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Header
        title="歌单推荐"
        rightContent={searchIcon}
        leftContent={indexIcon}
      />
      <View style={[styles.tab_container]}>
        <AntdTabs
          tabs={tabs}
          initialPage={0}
          tabBarPosition="top"
          renderTabBar={tabBarRender}
          renderUnderline={() => null}
          styles={{
            topTabBarSplitLine: {
              borderBottomWidth: 0,
            },
          }}>
          {tabs.map(tab => (
            <View style={[styles.tab_content]} key={tab.channel}>
              <SongGroup channel={tab.channel} />
            </View>
          ))}
        </AntdTabs>
      </View>
    </View>
  );
};
export default Home;
