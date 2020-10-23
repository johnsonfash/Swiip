/* eslint-disable linebreak-style */
import { FETCH_USER_DATA_REQUEST, RESET_USER_DATA, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_FAILURE } from '../actions/actionTypes';

const initialState = {
  userloading: 'false',
  userData: [],
  error: 'false',
  errorMessage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA_REQUEST:
      return {
        ...state,
        userloading: 'true'
      };
    case FETCH_USER_DATA_SUCCESS:
      return {
        error: 'false',
        errorMessage: '',
        userData: action.payload,
        userloading: 'done'
      };
    case RESET_USER_DATA:
      return {
        userloading: 'false',
        userData: [],
        error: 'false',
        errorMessage: ''
      };
    case FETCH_USER_DATA_FAILURE:
      return {
        ...state,
        userloading: 'done',
        error: 'true',
        errorMessage: action.payload
      };
    default:
      return state;
  }
};
