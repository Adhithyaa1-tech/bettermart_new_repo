import axios from "axios";
import {
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_REQUEST,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_DETAIL_REQUEST,

  NEW_REVIEW_FAIL,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_REQUEST,
  CLEAR_ERRORS,
} from "../constants/productConstants";

export const getProduct =
  (keyword = "", currentPage = 1, price = [0, 25000], category, rating=0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });

      let link = `http://localhost:4000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`
      
      if(category) {
        link = `http://localhost:4000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&rating[gte]=${rating}`
      }

      const { data } = await axios.get(link);
      

      dispatch({
        type: ALL_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCT_FAIL,
      payload: error.response && error.response.data.error ? error.response.data.error : error.message,
    
      })
    }
     
  };






  


export const getProductDetails = (id) => async (dispatch) => {
  try {
    console.log("pd dispatched");
    dispatch({ type: PRODUCT_DETAIL_REQUEST });

    const { data } = await axios.get(
      `http://localhost:4000/api/v1/product/${id}`
    );
    console.log("getproduct details", data);

    dispatch({
      type: PRODUCT_DETAIL_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    console.log("err", error);
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload: error.message,
    });
  }
};



export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};



// NEW REVIEW
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      withCredentials: true,
      headers: { 
        "Content-Type": "application/json" 
      },
    };

    const { data } = await axios.put(`http://localhost:4000/api/v1/review`, reviewData, config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.message,
    });
  }
};