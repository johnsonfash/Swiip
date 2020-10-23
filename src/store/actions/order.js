/* eslint-disable linebreak-style */
import axios from 'axios'
import { SET_ORDER } from './actionTypes';
import { userUiStartLoading, userUiStopLoading } from './ui';

export const setOrder = (order) => ({
  type: SET_ORDER,
  order
});

export const fetchOrderDataRequest = () => ({ type: "FETCH_ORDER_DATA_REQUEST" });
export const fetchOrderDataSuccess = (orderData) => ({ type: "FETCH_ORDER_DATA_SUCCESS", payload: orderData });
export const fetchOrderDataFailure = (error) => ({ type: "FETCH_ORDER_DATA_FAILURE", payload: error });

export const resetOrderData = () => async (dispatch) => {
  dispatch({type: 'RESET_ORDER_DATA'});
}

export const sendFetchOrderData = (data) => async (dispatch) => {
  try {
    dispatch(fetchOrderDataRequest());
    axios.post('https://swiip.000webhostapp.com/order.php', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    }).then(response => {
        const orderData = response.data;
        // console.log(data);
        dispatch(fetchOrderDataSuccess(orderData));
      })
      .catch(error => {
        const errorMessage = error.message;
        // console.log('fail');
        dispatch(fetchOrderDataFailure(errorMessage));
      })

  } catch (error) {

  }

}



export const getOrder = () => async (dispatch) => {
  try {
    // Make UI start loading was request started
    dispatch(userUiStartLoading());
    // Make necessary request to get the order, e.g
    // const res = await axios.get(`/order`);

    // Stop UI loading after response has been gotten
    dispatch(userUiStopLoading());
    // Performs necessary request after order has been gotten, e.g
    // Success:
    // if (res.success) {
    //   dispatch(setOrder(res.body));
    //   return null;
    // }
    // Failure, Unauthorized:
    // if (res.status === 401) {
    //   dispatch(resetApp());
    //   return 0;
    // }
  } catch (error) {
    dispatch(userUiStopLoading());
    // If error occurs in getting order, e.g
    // return 'Something went wrong. Check your connection.';
  }
};
