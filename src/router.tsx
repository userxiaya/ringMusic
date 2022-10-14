import React from 'react';
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '@/views/home';
import PlayerScreen from './PlayerScreen';
import SongGroupDetail from '@/views/songGroupDetail';
import SongGroupDesc from '@/views/songGroupDesc';

const options = {
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  // 过渡动效
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};
// 播放screen页面
const playerOption = {
  transitionSpec: {
    open: TransitionSpecs.BottomSheetSlideInSpec,
    close: TransitionSpecs.BottomSheetSlideOutSpec,
  },
  // 过渡动效
  cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
};
interface RouterConfig {
  name: string;
  component: React.ComponentType<any>;
}
const routesList: RouterConfig[] = [
  {name: 'Home', component: Home},
  {name: 'SongGroupDetail', component: SongGroupDetail},
  {name: 'SongGroupDesc', component: SongGroupDesc},
];
const Stack = createStackNavigator();
const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {routesList.map(e => {
          return (
            <Stack.Screen
              key={e.name}
              name={e.name}
              component={e.component}
              options={options}
            />
          );
        })}
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={playerOption}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Router;
