import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, Text, View} from 'react-native';

const PlayerScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>playerScreen</Text>
      <Button
        title="Go to Detail"
        onPress={() => navigation.navigate('SongGroupDetail', {id: '114514'})}
      />
    </View>
  );
};
export default PlayerScreen;
