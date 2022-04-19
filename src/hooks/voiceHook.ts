import {useContext, useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform, Rationale} from 'react-native';
import Permissions from 'react-native-permissions';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import {Context} from '../state/stateContext';
import {ctxPassThroughType} from '../type/state_type';
import usePostData, {PostdataType} from '../network/postDataHook';
import {API_PATH, BASE_URL} from '../const';
import {fileOptions} from '../network/formData';

type returnType = [() => Promise<void>, () => Promise<void>, boolean];

export const useVoiceAction = (): returnType => {
  const _checkPermission = async () => {
    const rationale: Rationale = {
      title: 'message.Chat.Voice.tips',
      message: 'message.Chat.Voice.tipsMessage',
      buttonPositive: '成功',
    };
    let askForGrant = false;
    // Android 检查权限，ios没有适配（懒得写）
    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale);
    if (status !== 'granted') {
      askForGrant = true;
    } else {
      setHasPermission(true);
    }

    if (askForGrant) {
      Alert.alert('我们可以获取您的录音权限吗?', '需要您同意录音权限才可录音', [
        {
          text: 'Later',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: Permissions.openSettings,
        },
      ]);
    }
  };

  const initVoice = () => {
    _checkPermission();
    //添加监听
    AudioRecorder.onProgress = data => {
      const currentTime = Math.floor(data.currentTime);
      if (currentTime >= 60) {
        Alert.alert('message.Chat.Voice.speakTooLong');
      }
    };
    AudioRecorder.onFinished = data => {
      // Android callback comes in the form of a promise instead.
      if (Platform.OS === 'ios') {
      }
    };
  };

  const [recording, setRecording] = useState(false);

  const [hasPermission, setHasPermission] = useState(false);

  const {dispatch, state}: ctxPassThroughType = useContext(Context);

  const [setReqParams, setURL, {isError, isFetching, data}]: PostdataType = usePostData({
    initUrl: `${BASE_URL}${API_PATH.UPLOAD_AUDIO}`,
    initData: {},
    options: fileOptions,
  });

  // 转化录音格式
  const prepareRecordingPath = (audioPath: string) => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      OutputFormat: 'aac_adts',
    });
  };

  // 上传音频文件
  const uploadAudioFile = (filePath: string) => {
    const audioFileUrl = 'file://' + filePath;
    setReqParams({
      token: state.userInfo.token,
      chatID: state.CurChatItem.ChatID,
      sender: state.userInfo.userID,
      recipient: state.CurChatItem.ChatToUserID,
      file: audioFileUrl,
      fileName: filePath.split('/')[6],
    });
  };

  // 开始录音
  const _startRecognizing = async () => {
    if (recording) return;
    if (!hasPermission) return;

    setRecording(true);

    const audioPath = AudioUtils.DocumentDirectoryPath + `/${state.userInfo.userID}_${new Date().getTime()}.aac`;
    prepareRecordingPath(audioPath);
    try {
      const filePath = await AudioRecorder.startRecording();
      console.log('startRecord', filePath);
    } catch (error) {}
  };

  // 结束录音，松手
  const _stopRecognizing = async () => {
    if (!recording) return;
    setRecording(false);
    try {
      const filePath = await AudioRecorder.stopRecording();
      uploadAudioFile(filePath);
    } catch (error) {}
  };

  useEffect(() => {
    initVoice();
    return () => {};
  }, []);

  return [_startRecognizing, _stopRecognizing, recording];
};
