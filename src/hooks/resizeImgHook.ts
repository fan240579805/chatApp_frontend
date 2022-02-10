import {useEffect, useState} from 'react';
import {Dimensions, Image} from 'react-native';

type imgInfo = [number, number];

export default function useResizeImg(type: string, url: string): imgInfo {
  const [img_width, setWidth] = useState(120);
  const [img_height, setHeight] = useState(120);
  useEffect(() => {
    //方法一代码：
    if (type === 'image') {
      let screenWidth = Dimensions.get('window').width;
      let screenHeight = Dimensions.get('window').height;
      Image.getSize(url, (width, height) => {
        //width 图片的宽度 Math.floor向下取整
        //height 图片的高度
        let proportion = width / height;
        if (proportion === 1) {
          setWidth(120);
          setHeight(120);
        } else if (proportion < 1) {
          setWidth(120);
          setHeight(230);
        } else {
          setWidth(260);
          setHeight(120);
        }
      });
    }
  }, [type, url]);

  return [img_width, img_height];
}
