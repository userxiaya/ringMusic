import TrackPlayer, {RepeatMode} from 'react-native-track-player';

export const QueueInitalTracksService = async (): Promise<void> => {
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
};
