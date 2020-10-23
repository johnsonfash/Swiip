/* eslint-disable linebreak-style */
import axios from 'axios';
// import { FETCH_COMMUNITY_DATA_REQUEST, FETCH_COMMUNITY_DATA_SUCCESS, FETCH_COMMUNITY_DATA_FAILURE } from './actionTypes';

export const fetchAdminDataRequest = () => ({ type: "FETCH_ADMIN_DATA_REQUEST" });
export const fetchAdminDataSuccess = (data) => ({ type: "FETCH_ADMIN_DATA_SUCCESS", payload: data });
export const fetchAdminDataFailure = (error) => ({ type: "FETCH_ADMIN_DATA_FAILURE", payload: error });


export const sendAdminData = (data) => async (dispatch) => {
  try {
    dispatch(fetchAdminDataRequest());
    axios.post('https://swiip.000webhostapp.com/account.php', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
        const userData = response.data;
        dispatch(fetchAdminDataSuccess(userData));
      })
      .catch(error => {
        const errorMessage = error.message;
        dispatch(fetchAdminDataFailure(errorMessage));
      })

  } catch (error) {

  }
}