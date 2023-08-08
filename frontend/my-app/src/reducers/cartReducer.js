import {
  ADD_TO_CART,
  CLEAR_CART_ITEMS,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/CartConstants";

export const cartReducer = (
  state = {
    cartItems: [],
  },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    case CLEAR_CART_ITEMS:
      // Handle CLEAR_CART_ITEMS action here
      // This will reset the cartItems array to an empty array
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};


