import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import Sound from 'react-native-sound';

type returnType = [
  number,
  number,
  number,
  () => void,
  () => void,
  boolean,
  Dispatch<SetStateAction<boolean>>,
];

export const usePlaySound = (
  msgType: string,
  musciPath: string,
): returnType => {
  const [duration, setduration] = useState(0);

  const [curTime, setCurTime] = useState(0);

  const [showTime, setshowTime] = useState(0);

  const [isPlaying, setisPlay] = useState(false);

  const [sound, setsound] = useState<Sound | undefined>(undefined); // 每个语音聊天记录的实例

  let timer: NodeJS.Timer;

  const initSound = () => {
    if (msgType === 'audio') {
      const sound = new Sound(musciPath, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(error);
          Alert.alert('播放失败...');
          return;
        }
        const _duration = Math.ceil(sound.getDuration());
        setduration(_duration);
        setshowTime(_duration);
      });
      setsound(sound);
    }
  };

  const _getCurTime = () => {
    let curTimeSecond = 0;
    sound?.getCurrentTime(seconds => {
      curTimeSecond = Math.ceil(seconds);
      setCurTime(curTimeSecond);
    });
  };

  const _play = () => {
    initSound();
    setisPlay(true);
    let reverseTime = duration - curTime;
    timer = setInterval(() => {
      reverseTime = reverseTime - 1;
      _getCurTime();
      setshowTime(reverseTime);
    }, 1000);
    sound?.play(success => {
      if (success) {
        console.log('播放成功，重置播放状态');
        clearInterval(timer);
        setisPlay(false);
        setshowTime(duration);
        setCurTime(0);
      } else {
        console.log('播放失败，解码错误');
      }
    });
  };

  const _pause = () => {
    setisPlay(false);
    sound?.pause();
  };

  useEffect(() => {
    initSound();
    return () => {
      clearInterval(timer);
    };
  }, []);

  return [duration, curTime, showTime, _play, _pause, isPlaying, setisPlay];
};
