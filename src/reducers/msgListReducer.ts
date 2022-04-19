import {stateStatus} from '../const';
import {ctxActionType} from '../type/actions_type';
import {
  chatListItemType,
  message,
  msgType,
  stateType,
} from '../type/state_type';

export interface msgListStateType {
  msgList: Array<msgType>;
}

export interface ActionType {
  type: string;
  playloads: any;
}

export enum MsgStatus {
  UN_SHIFT_LIST = 'UN_SHIFT_LIST',
  SET_CUR_MSG_LIST = 'SET_CUR_MSG_LIST',
  APPEND_MSG_LIST = 'APPEND_MSG_LIST',
  REMOVE_CUR_MSG = 'REMOVE_CUR_MSG',
}

export function msgReducer(
  state: msgListStateType,
  action: ActionType,
): msgListStateType {
  switch (action.type) {
    case MsgStatus.SET_CUR_MSG_LIST:
      return {
        ...state,
        msgList: action.playloads,
      };
    case MsgStatus.UN_SHIFT_LIST:
      const nextMsgList: Array<msgType> = [].concat(action.playloads);
      const newMsgList: Array<msgType> = nextMsgList.concat(state.msgList);
      return {
        ...state,
        msgList: newMsgList,
      };
    case MsgStatus.APPEND_MSG_LIST:
      state.msgList.push(action.playloads);
      return {
        ...state,
      };
    case MsgStatus.REMOVE_CUR_MSG:
      const willRealDelMsgID = action.playloads
      return {
        ...state,
        msgList:state.msgList.filter(mItem => mItem.msgid !== willRealDelMsgID)
      }
    default:
      return {
        ...state,
      };
  }
}
