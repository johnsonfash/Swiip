/* eslint-disable linebreak-style */
import axios from 'axios';
// import { FETCH_COMMUNITY_DATA_REQUEST, FETCH_COMMUNITY_DATA_SUCCESS, FETCH_COMMUNITY_DATA_FAILURE } from './actionTypes';

export const fetchCommunityDataRequest = () => ({ type: "FETCH_COMMUNITY_DATA_REQUEST" });
export const fetchCommunityDataSuccess = (data) => ({ type: "FETCH_COMMUNITY_DATA_SUCCESS", payload: data });
export const fetchCommunityDataFailure = (error) => ({ type: "FETCH_COMMUNITY_DATA_FAILURE", payload: error });


export const sendCommunityData = (data) => async (dispatch) => {
  try {
    dispatch(fetchCommunityDataRequest());
    axios.post('https://swiip.000webhostapp.com/community.php', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(response => {
        const userData = response.data;
        dispatch(fetchCommunityDataSuccess(userData));
      })
      .catch(error => {
        const errorMessage = error.message;
        dispatch(fetchCommunityDataFailure(errorMessage));
      })

  } catch (error) {

  }
}