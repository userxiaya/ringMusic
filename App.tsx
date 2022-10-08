import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Button,
  DrawerLayoutAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import Router from '@/router';
import ThemeStore, {ThemeContext} from '@/store/theme';
import eventBus from '@/utils/bus';
import TrackPlayer from 'react-native-track-player';
import {SetupService, QueueInitalTracksService} from '@/services';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  DrawerContent: {
    paddingTop: 80,
    paddingLeft: 20,
    paddingRight: 20,
  },
  DrawerContentBtn: {
    marginBottom: 10,
  },
});
const DrawerContent = (props: {onColorChange?: () => void}) => {
  const {onColorChange} = props;
  const {dispatch} = useContext(ThemeContext);
  const list = [
    {name: 'qq绿', color: '#07c160'},
    {name: '网易红', color: '#C20C0C'},
    {name: '酷狗蓝', color: '#00A9FF'},
  ];
  return (
    <View style={styles.DrawerContent}>
      {list.map(e => (
        <TouchableHighlight
          key={e.name}
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.DrawerContentBtn}>
          <Button
            title={e.name}
            color={e.color}
            onPress={() => {
              dispatch({
                type: 'SET_THEME',
                text_color: e.color,
              });
              onColorChange?.();
            }}
          />
        </TouchableHighlight>
      ))}
    </View>
  );
};

function App() {
  const [isMounted, setMounted] = useState<boolean>(false);
  const drawerRef = useRef<DrawerLayoutAndroid | null>();
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    async function run() {
      const isSetup = await SetupService();
      setIsPlayerReady(isSetup);

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await QueueInitalTracksService();
      }
    }
    run();
    setMounted(true);
    eventBus.addListener('openDrawer', () => {
      drawerRef.current?.openDrawer();
    });
    return () => {
      setMounted(false);
    };
  }, []);
  const sidebar = (
    <DrawerContent
      onColorChange={() => {
        drawerRef.current?.closeDrawer();
      }}
    />
  );
  return (
    isPlayerReady && (
      <SafeAreaView style={styles.safeArea}>
        <ThemeStore>
          <DrawerLayoutAndroid
            ref={el => (drawerRef.current = el)}
            drawerWidth={300}
            drawerBackgroundColor="#fff"
            drawerPosition="left"
            drawerLockMode="locked-closed"
            renderNavigationView={() => sidebar}>
            <StatusBar
              translucent={isMounted}
              backgroundColor="transparent"
              barStyle="dark-content"
            />
            <Router />
          </DrawerLayoutAndroid>
        </ThemeStore>
      </SafeAreaView>
    )
  );
}
export default App;
