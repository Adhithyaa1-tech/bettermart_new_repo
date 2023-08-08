import {ORDER_DETAILS_FAIL,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_REQUEST,} from '../constants/orderConstants'

export const orderDetailsReducer = (state = { order: {} }, action) => {
    console.log(state);
    switch (action.type) {

      case ORDER_DETAILS_REQUEST:
        return {
          loading: true,
        };

      case ORDER_DETAILS_SUCCESS:
        
        return {
          loading: false,
          order: action.payload,
        };
  
      case ORDER_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      default:
        return state;
    }
  };
  



