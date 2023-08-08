
import { SAVE_SHIPPING_INFO } from "../constants/CartConstants";

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });

    console.log('data of shipping info',data );
  
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };