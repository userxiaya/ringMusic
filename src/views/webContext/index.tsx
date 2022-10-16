import React from 'react';
import {WebView} from 'react-native-webview';
import {useRoute} from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import {useCreation} from 'ahooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const WebContext = () => {
  const route = useRoute();
  const source = useCreation(() => {
    const params = (route?.params as {url: string}) || {url: ''};
    return {uri: params?.url || ''};
  }, [route.params]);
  return <WebView source={source} style={styles.container} />;
};
export default WebContext;
