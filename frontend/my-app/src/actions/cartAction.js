import { ADD_TO_CART , REMOVE_CART_ITEM, SAVE_SHIPPING_INFO, CLEAR_CART_ITEMS} from "../constants/CartConstants";

import axios from './AxiosInstance'

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/product/${id}`);

    console.log('data', data);
  
    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0].url,
        stock: data.product.Stock,
        quantity,
      },
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };




  export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
  
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
  };

  export const clearCartItems = () => async(dispatch, getState) => {
    dispatch({
      type:  CLEAR_CART_ITEMS
    })
  }
  


