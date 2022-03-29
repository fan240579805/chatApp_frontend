/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useImperativeHandle, useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Image, Button} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {API_PATH, BASE_URL, fetchStatus} from '../../const';
import usePostData, {PostdataType, showTips} from '../../network/postDataHook';
import {fileOptions} from '../../network/formData';
import {Context} from '../../state/stateContext';
import {ctxPassThroughType} from '../../type/state_type';
import {fetchActionType} from '../../type/actions_type';
interface uploadProps {
  hasBtn: boolean;
  cRef: any;
  iconName?: string;
  apiPath?: string;
  dispatchNewData?: (value: fetchActionType) => void; // 请求成功后dispatch更新父组件展示的数据
  setModalVisable?: (value: boolean) => void;
  AfterUploadCb?: () => void; // 成功上传图片后执行的函数
  chatID?: string;
  recipient?: string;
  canChat?: boolean;
}

const UploadImageBtn: React.FC<uploadProps> = ({
  hasBtn,
  cRef,
  iconName = 'md-camera',
  apiPath = API_PATH.MODIFY_AVATAR,
  dispatchNewData,
  setModalVisable,
  chatID,
  recipient,
  canChat = true,
}) => {
  // 相册中的uri
  const [imgUrl, setimgUrl] = useState('');
  const [imageName, setimageName] = useState('');
  const {dispatch, state}: ctxPassThroughType = useContext(Context);
  // 提交成功回调函数
  const successCbFunc = (res: any) => {
    // 更新数据成功后将新数据 dispatch分发给父组件以便页面同步新改的数据
    dispatchNewData &&
      dispatchNewData({type: fetchStatus.SUCCESS, playload: res});
    setModalVisable && setModalVisable(false);
  };
  const [setReqParams, setURL, {isError, isFetching, data}]: PostdataType =
    usePostData({
      initUrl: `${BASE_URL}${apiPath}`,
      initData: {},
      successCbFunc,
      options: fileOptions,
    });

  // 封装好的上传图片方法，暴露给父组件或自己用，待完善
  const uploadFile = async () => {
    let reqConfig;
    reqConfig =
      apiPath === API_PATH.UPLOAD_CHATIMG
        ? {
            token: state.userInfo.token,
            chatID: chatID,
            sender: state.userInfo.userID,
            recipient: recipient,
            file: imgUrl,
            fileName: imageName,
          }
        : {
            token: state.userInfo.token,
            InfoAttr: 'avatar',
            userid: state.userInfo.userID,
            file: imgUrl,
            fileName: imageName,
          };
    setReqParams(reqConfig);
  };
  useImperativeHandle(
    cRef,
    () => ({
      imgUrl: imgUrl,
      fileName: imageName,
      uploadFile: uploadFile,
      isError: isError,
      isFetching: isFetching,
    }),
    [imgUrl, imageName, uploadFile, isError, isFetching],
  );
  // 拉起相册方法
  const showImagePicker = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.didCancel) {
      console.log('User cancelled image picker');
      return;
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
      return;
    }
    const {assets} = result;
    if (assets && assets[0]) {
      const {uri, fileName} = assets[0];
      console.log(fileName);
      uri && setimgUrl(uri);
      fileName && setimageName(fileName);
    }
  };
  return (
    <View>
      <View style={styles.cameraBtn}>
        <TouchableOpacity onPress={() => showImagePicker()}>
          {imgUrl.length === 0 ? (
            <Icon name={iconName} color="#aaa" size={105} />
          ) : (
            <View style={styles.ImageWrap}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.Image}
                source={{uri: imgUrl}}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
      {hasBtn && (
        <View style={styles.subBtn}>
          <Button
            title=" 提交 "
            onPress={() => {
              canChat && uploadFile();
              !canChat && showTips('你们的好友关系拉黑或删除，无法聊天');
            }}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cameraBtn: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 16,
    borderColor: '#eeee',
  },
  Image: {
    width: 110,
    height: 110,
    borderRadius: 15,
    borderWidth: 1,
  },
  ImageWrap: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 16,
  },
  subBtn: {
    width: '100%',
    flexDirection: 'row-reverse',
  },
});

export default UploadImageBtn;
