import { SAVE_SHIPPING_INFO } from "../constants/CartConstants";


export const shippingReducer = (
    state = {
      shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
        phoneNo: "",
      },
    },
    action
  ) => {
    switch (action.type) {
      case SAVE_SHIPPING_INFO:
        console.log("shipping reducer here");
        return {
          ...state,
          shippingInfo: action.payload,
        };
  
        default:
          return state;
    }
  };