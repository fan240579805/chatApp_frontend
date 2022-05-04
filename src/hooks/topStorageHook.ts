import {useEffect, useState} from 'react';
import {chatListItemType} from '../type/state_type';
import storage, {getValueFromStorage, StorageHasValue} from '../utils/storage';

type returnType = [boolean, React.Dispatch<React.SetStateAction<boolean>>, () => Promise<void>, () => Promise<void>];
// 获取置顶 chatList 钩子🪝
export default function useTopFromStorage(CurChatItem: chatListItemType): returnType {
  const [isTop, setTop] = useState(false); // 该chat是否置顶

  const removeChatId = async () => {
    // 补充缓存，从chatIDS中移除相应的chatid
    try {
      const ChatIdsJSON = await getValueFromStorage('topChatIds');
      let ChatIds: string[] = JSON.parse(ChatIdsJSON);
      ChatIds = ChatIds.filter(chatid => chatid !== CurChatItem.ChatID);
      await storage.remove({key: 'topChatIds'});
      await storage.save({key: 'topChatIds', data: JSON.stringify(ChatIds)});
    } catch (error) {
      console.log('本地移除置顶id出错');
    }
  };

  const appendToChatIds = async () => {
    // 缓存添加chatIDs
    try {
      const hasChatIDs = await StorageHasValue('topChatIds');
      let topChatIds = new Array<string>();
      if (hasChatIDs) {
        const topChatIdsJSON = await getValueFromStorage('topChatIds');
        await storage.remove({key: 'topChatIds'});
        topChatIds = JSON.parse(topChatIdsJSON);
        topChatIds.push(CurChatItem.ChatID);
      } else {
        topChatIds = [CurChatItem.ChatID];
      }
      storage.save({key: 'topChatIds', data: JSON.stringify([...topChatIds])});
    } catch (error) {
      console.log('本地存储置顶id出错');
    }
  };

  useEffect(() => {
    const checkChatIDisTop = async () => {
      // 缓存添加chatIDs
      const hasChatIDs = await StorageHasValue('topChatIds');
      if (hasChatIDs) {
        const topChatIdsJSON = await getValueFromStorage('topChatIds');
        const topChatIds: string[] = JSON.parse(topChatIdsJSON);
        setTop(topChatIds.findIndex(chatID => chatID === CurChatItem.ChatID) !== -1);
      } else {
        setTop(false);
      }
    };
    checkChatIDisTop();
  }, [CurChatItem.ChatID]);

  return [isTop, setTop, removeChatId, appendToChatIds];
}
