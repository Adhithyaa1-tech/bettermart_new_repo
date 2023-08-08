// import { legacy_createStore as createStore} from 'redux'
// import { combineReducers, applyMiddleware } from "redux";

// import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";
// import {productReducer,  productDetailsReducer}  from "./reducers/productReducer";
// import { userReducer } from './reducers/userReducer';
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// const persistConfig = {
//   key: 'root',
//   storage,
// };

// const reducer = combineReducers({
//     products: productReducer,
//     productDetails: productDetailsReducer,
//     user: userReducer
// });

// let initialState = {};
// const middleware = [thunk];

// const persistedReducer = persistReducer(persistConfig, reducer)

// const store = createStore(
//   persistedReducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// const persistor = persistStore(store);

// export default {store, persistor};
























import { legacy_createStore as createStore } from "redux";
// import { createStore} from 'redux';

import { combineReducers, applyMiddleware } from "redux";

import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productReducer,
  productsReducer,
  productDetailsReducer,
  newReviewReducer,
  adminproductReducer,
  newProductReducer,
} from "./reducers/productReducer";
import {
  profileReducer,
  userReducer,
  forgotPasswordReducer,
} from "./reducers/userReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { cartReducer} from "./reducers/cartReducer";
import { shippingReducer } from "./reducers/shippingReducer";
import { myOrdersReducer, newOrderReducer} from "./reducers/orderReducer";
import { orderDetailsReducer } from "./reducers/orderDetailsReducer";

const persistConfig = {
  key: "root",
  storage,
};

const reducer = combineReducers({
  products: productsReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  shipping: shippingReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  myOrderDetails: orderDetailsReducer,
  newReview: newReviewReducer,
  adminProduct: adminproductReducer,
  newProduct: newProductReducer
});

let initialState = {
  products: {
    products: []
  },

  productDetails: {
    product: null
  },

  profile: {
    profile: null
  },

  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },

  shipping: {
    shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {}, 
  }
}
const middleware = [thunk];

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export const persistor = persistStore(store);

export default store;













// ///FROM CHATGPT

// import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux"; // Use the 'redux' package instead of 'redux' with 'legacy_createStore' alias
// import thunk from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools-extension";
// import {
//   productReducer,
//   productsReducer,
//   productDetailsReducer,
//   newReviewReducer,
//   adminproductReducer,
//   newProductReducer,
// } from "./reducers/productReducer";
// import {
//   profileReducer,
//   userReducer,
//   forgotPasswordReducer,
// } from "./reducers/userReducer";
// import { cartReducer } from "./reducers/cartReducer";
// import { shippingReducer } from "./reducers/shippingReducer";
// import { myOrdersReducer, newOrderReducer } from "./reducers/orderReducer";
// import { orderDetailsReducer } from "./reducers/orderDetailsReducer";

// const reducer = combineReducers({
//   products: productsReducer,
//   product: productReducer,
//   productDetails: productDetailsReducer,
//   user: userReducer,
//   profile: profileReducer,
//   forgotPassword: forgotPasswordReducer,
//   cart: cartReducer,
//   shipping: shippingReducer,
//   newOrder: newOrderReducer,
//   myOrders: myOrdersReducer,
//   myOrderDetails: orderDetailsReducer,
//   newReview: newReviewReducer,
//   adminProduct: adminproductReducer,
//   newProduct: newProductReducer,
// });

// // Your initialState
// let initialState = {
//   products: {
//     products: [],
//   },

//   // productDetails: {
//   //   product: null,
//   // },

//   profile: {
//     profile: null,
//   },

//   cart: {
//     cartItems: localStorage.getItem("cartItems")
//       ? JSON.parse(localStorage.getItem("cartItems"))
//       : [],
//   },

//   shipping: {
//     shippingInfo: localStorage.getItem("shippingInfo")
//       ? JSON.parse(localStorage.getItem("shippingInfo"))
//       : {},
//   },
// };

// const middleware = [thunk];

// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store;
