//当前播放的音乐
import React, {createContext, useReducer, ReactNode} from 'react';

export interface ThemeStoreState {
  text_color?: string; // 主题文字颜色
}
interface Action extends ThemeStoreState {
  type?: 'SET_THEME';
}
function reducer(state: ThemeStoreState, action?: Action) {
  switch (action?.type) {
    case 'SET_THEME':
      const result = {...state, ...action};
      delete result.type;
      return result;
    default:
      return state;
  }
}
interface ThemeStoreProps {
  children: ReactNode;
}

export const ThemeContext = createContext<{
  state?: ThemeStoreState;
  dispatch: React.Dispatch<Action>;
}>({
  state: {},
  dispatch: () => null,
});
const ThemeStore = (props: ThemeStoreProps) => {
  const initState = {
    text_color: '#07c160', //字体颜色
  };
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <ThemeContext.Provider value={{state, dispatch}}>
      {props.children}
    </ThemeContext.Provider>
  );
};
export default ThemeStore;
