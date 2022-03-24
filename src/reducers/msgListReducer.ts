import {stateStatus} from '../const';
import {ctxActionType} from '../type/actions_type';
import {chatListItemType, msgType, stateType} from '../type/state_type';

export interface msgListStateType {
  msgList: Array<msgType>;
}

export interface ActionType {
  type: string;
  playloads: any;
}

export enum MsgStatus {
  SET_CUR_MSG_LIST = 'SET_CUR_MSG_LIST',
  APPEND_MSG_LIST = 'APPEND_MSG_LIST',
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
    case MsgStatus.APPEND_MSG_LIST:
      state.msgList.push(action.playloads);
      return {
        ...state,
      };
    default:
      return {
        ...state,
      };
  }
}
