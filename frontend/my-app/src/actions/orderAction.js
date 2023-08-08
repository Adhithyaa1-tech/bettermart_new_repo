import {
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    MY_ORDERS_FAIL,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_REQUEST,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
  } from "../constants/orderConstants";


import axios from './AxiosInstance';
// import axios from "axios";


export const createOrder = (order) => async (dispatch) => {
    try {
        console.log('ORDER ACTION', order);
        dispatch({
            type: CREATE_ORDER_REQUEST
        });

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log('before order action')
        const {data} = await axios.post(`/order/create`, order, config);

        console.log('ORDERS CREATED',data);

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        });


    } catch (error) {
        console.log(error);
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message
        });
    }
} 


export const myOrders = () => async (dispatch, getState) => {
    try {

        dispatch({
            type: MY_ORDERS_REQUEST
        });


        const {data} = await axios.get('/orders/me');

        console.log('MY ORDERS', data);

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders
        });


    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.message
        });
    }
} 

