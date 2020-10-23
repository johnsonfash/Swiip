/* eslint-disable linebreak-style */
import { FETCH_ADMIN_DATA_REQUEST, FETCH_ADMIN_DATA_SUCCESS, FETCH_ADMIN_DATA_FAILURE } from '../actions/actionTypes';

const initialState = {
  loading: 'false',
  adminData: [],
  error: 'false',
  errorMessage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ADMIN_DATA_REQUEST:
      return {
        ...state,
        loading: 'true'
      }
    case FETCH_ADMIN_DATA_SUCCESS:
      return {
        ...state,
        adminData: action.payload,
        loading: 'done',
      }
    case FETCH_ADMIN_DATA_FAILURE:
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