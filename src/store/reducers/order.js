/* eslint-disable linebreak-style */
import { FETCH_ORDER_DATA_REQUEST, RESET_ORDER_DATA, FETCH_ORDER_DATA_SUCCESS, FETCH_ORDER_DATA_FAILURE } from '../actions/actionTypes';

const initialState = {
  orderloading: 'false',
  orderData: [],
  error: 'false',
  errorMessage: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDER_DATA_REQUEST:
      return {
        ...state,
        orderloading: 'true'
      };
    case FETCH_ORDER_DATA_SUCCESS:
      return {
        error: 'false',
        errorMessage: '',
        orderData: action.payload,
        orderloading: 'done'
      };
    case RESET_ORDER_DATA:
      return {
        orderloading: 'false',
        orderData: [],
        error: 'false',
        errorMessage: ''
      };
    case FETCH_ORDER_DATA_FAILURE:
      return {
        ...state,
        orderloading: 'done',
        error: 'true',
        errorMessage: action.payload
      };
    default:
      return state;
  }
};
