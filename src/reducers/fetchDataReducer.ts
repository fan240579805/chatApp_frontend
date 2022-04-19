import {fetchActionType} from '../type/actions_type';
import {API_DATA_TYPE} from '../type/api_types';
import {fetchStatus} from '../const';

export function fetchReducer(state: API_DATA_TYPE, action: fetchActionType): API_DATA_TYPE {
  switch (action.type) {
    case fetchStatus.INIT:
      return {
        ...state,
        isError: false,
        isFetching: true,
      };
    case fetchStatus.SUCCESS:
      if (Array.isArray(action.playload)) {
        return {
          ...state,
          isError: false,
          isFetching: false,
          data: action.playload,
        };
      }
      return {
        ...state,
        isError: false,
        isFetching: false,
        data: {
          ...state.data,
          ...action.playload,
        },
      };
    case fetchStatus.ERROR:
      return {
        ...state,
        isError: true,
        isFetching: false,
      };
    default:
      return {
        ...state,
      };
  }
}
