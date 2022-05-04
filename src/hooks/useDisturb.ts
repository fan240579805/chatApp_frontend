import {useEffect, useState} from 'react';
import {chatListItemType} from '../type/state_type';
import storage, {getValueFromStorage, StorageHasValue} from '../utils/storage';

type returnType = [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => Promise<Record<string, boolean>>,
  () => Promise<Record<string, boolean>>,
];
// 获取置顶 chatList 钩子🪝
export default function useToggleDisturb(CurChatItem: chatListItemType): returnType {
  const [isDisturb, setDisturbStatus] = useState(false); // 该chat是否置顶

  // 取消免打扰
  const CancelUnDisturb = async (): Promise<Record<string, boolean>> => {
    try {
      const disturbMapJSON = await getValueFromStorage('disturbMap');
      await storage.remove({key: 'disturbMap'});
      let disturbMap: Record<string, boolean> = JSON.parse(disturbMapJSON);
      let _map: Record<string, boolean> = {...disturbMap};
      _map[CurChatItem.ChatID] = false;
      await storage.save({key: 'disturbMap', data: JSON.stringify({..._map})});
      return _map;
    } catch (error) {
      console.log('本地免打扰出错');
      return {};
    }
  };

  // 新增免打扰
  const appendToDisturb = async (): Promise<Record<string, boolean>> => {
    // 缓存添加chatIDs
    try {
      const hasMap = await StorageHasValue('disturbMap');
      let _map: Record<string, boolean> = {};
      if (hasMap) {
        const disturbMapJSON = await getValueFromStorage('disturbMap');
        await storage.remove({key: 'disturbMap'});
        const _dmap: Record<string, boolean> = JSON.parse(disturbMapJSON);
        _dmap[CurChatItem.ChatID] = true;
        await storage.save({key: 'disturbMap', data: JSON.stringify({..._dmap})});
        _map = {..._dmap};
      } else {
        _map[CurChatItem.ChatID] = true;
        storage.save({key: 'disturbMap', data: JSON.stringify({..._map})});
      }

      return _map;
    } catch (error) {
      console.log('本地存储新增免打扰出错');
      return {};
    }
  };

  useEffect(() => {
    const checkisDisturb = async () => {
      // 缓存添加map
      const hasMap = await StorageHasValue('disturbMap');
      if (hasMap) {
        const disturbMapJSON = await getValueFromStorage('disturbMap');
        const disturbMap: Record<string, boolean> = JSON.parse(disturbMapJSON);
        setDisturbStatus(disturbMap[CurChatItem.ChatID]);
      } else {
        setDisturbStatus(false);
      }
    };
    checkisDisturb();
  }, [CurChatItem.ChatID]);

  return [isDisturb, setDisturbStatus, CancelUnDisturb, appendToDisturb];
}
