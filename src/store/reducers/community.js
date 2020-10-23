/* eslint-disable linebreak-style */
import { FETCH_COMMUNITY_DATA_REQUEST, FETCH_COMMUNITY_DATA_SUCCESS, FETCH_COMMUNITY_DATA_FAILURE } from '../actions/actionTypes';

const initialState = {
  loading: 'false',
  communityData: [],
  error: 'false',
  errorMessage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COMMUNITY_DATA_REQUEST:
      return {
        ...state,
        loading: 'true'
      }
    case FETCH_COMMUNITY_DATA_SUCCESS:
      return {
        ...state,
        communityData: action.payload,
        loading: 'done',
      }
    case FETCH_COMMUNITY_DATA_FAILURE:
      return {
        ...state,
        loading: 'done',
        error: 'true',
        errorMessage: action.payload
      }
    default:
      return state;
  }
};