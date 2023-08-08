import {
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
} from "../constants/orderConstants";


import axios from './AxiosInstance'
export const getOrderDetails = (id) => async (dispatch) => {
  try {
    console.log("in ord det aion");

    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    console.log(id);

    const { data } = await axios.get(`/order/${id}`);

    console.log("order det", data);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data.order,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.message,
    });
  }
};
