import React, {useContext} from 'react';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useCreation} from 'ahooks';
import Header from '@/components/header';
import {ThemeContext} from '@/store/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const WebContext = () => {
  const route = useRoute();
  const params = (route?.params as {url: string; title?: string}) || {url: ''};
  const source = useCreation(() => {
    return {uri: params?.url || ''};
  }, [route.params]);
  const {state: theme} = useContext(ThemeContext);
  const headerColorStyle = StyleSheet.create({
    style: {backgroundColor: theme?.text_color},
  });
  const headContainer = useCreation(() => {
    return (
      <Header
        style={headerColorStyle.style}
        color={'#fff'}
        title={params?.title || '歌曲'}
      />
    );
  }, [headerColorStyle]);
  return (
    <SafeAreaView style={[styles.container]}>
      {headContainer}
      <WebView
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        javaScriptEnabled={true}
        mixedContentMode={'compatibility'} //指定混合内容模式(不设置在qq音乐和网易云音乐原页面无法播放)。即 WebView 是否应该允许安全链接（https）页面中加载非安全链接（http）的内容,compatibility - WebView 会尽量和浏览器当前对待此情况的行为一致
        thirdPartyCookiesEnabled={true}
        useWebKit={true}
        source={source}
        style={styles.container}
      />
    </SafeAreaView>
  );
};
export default WebContext;
