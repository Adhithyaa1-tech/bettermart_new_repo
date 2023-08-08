import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import webFont from "webfontloader";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Loader from "./components/layout/Loader/Loader";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products.js";
import Search from "./components/Product/Search.js";
import LoginSignup from "./components/User/LoginSignup";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/UserOptions/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile.js";
import PrivateRoute from "./Routes/ProtectedRoutes";
import UpdateProfile from "./components/User/UpdateProfile";
import UpdatePassword from "./components/User/UpdatePassword";
import ForgotPassword from "./components/User/ForgotPassword";
import Cart from "./components/Cart/Cart";
import Shipping from "./components/Cart/Shipping";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import Payment from "./components/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import OrderSuccess from "./components/Cart/OrderSuccess";
import MyOrders from "./components/Order/MyOrders";
import OrderDetails from "./components/Order/OrderDetails";
import Contact from "./components/layout/Contact";
import About from "./components/layout/About";

import Dashboard from "./components/admin/Dashboard";
import ProductList from "./components/admin/ProductList"
import NewProduct from "./components/admin/NewProduct";
import ResetPassword from "./components/User/ResetPassword";
import UpdateProduct from "./components/admin/UpdateProduct";



function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const KEY =
    "pk_test_51N88uDSDuaFRGf0WnpKCriBAzKlZNYMzJActqypgd4uFjpltDyqmUM6ufp7o5JTlovOjS5tWn8lgZofDLMxCTIwQ006dpaP32R";

  console.log("user here", user);

  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripeTestPromise, setStripeTestPromise] = useState(null);

  // stripeTestPromise = loadStripe(KEY);

  const getStripeApiKey = async () => {
    try {
      // const { data } = await axios.get(`http://localhost:4000/api/v1/stripeapikey`, {
      //   withCredentials: true
      // });

      // console.log('data', data);
      setStripeApiKey(KEY);
    } catch (error) {
      console.log("error in fetching the sptripe api key", error);
    }
  };

  useEffect(() => {
    webFont.load({
      google: {
        families: ["roboto", "Droid Sans", "Chilanka"],
      },
    });

    console.log("LOGGED IN??", isAuthenticated);
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/me/update"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/password/update"
            element={
              <PrivateRoute>
                <UpdatePassword />
              </PrivateRoute>
            }
          />
          <Route path="/password/forgot" element={<ForgotPassword />} />

          <Route path="/password/reset/:token" element={<ResetPassword/>}/>

          <Route path="/cart" element={<Cart />} />
          <Route
            path="/shipping"
            element={
              <PrivateRoute>
                <Shipping />
              </PrivateRoute>
            }
          />
          <Route
            path="/order/confirm"
            element={
              <PrivateRoute>
                <ConfirmOrder />
              </PrivateRoute>
            }
          />

          {stripeApiKey && (
            <Route
              path="/payment/process"
              element={
                <PrivateRoute>
                  <Elements stripe={loadStripe(KEY)}>
                    <Payment />
                  </Elements>
                </PrivateRoute>
              }
            />
          )}
          <Route path="/success" element={<PrivateRoute><OrderSuccess/></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><Contact/></PrivateRoute>}/>
          <Route path="/admin/dashboard" element={<PrivateRoute> <Dashboard/> </PrivateRoute>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/admin/products" element={<PrivateRoute isAdmin={true}> <ProductList/> </PrivateRoute>}/>
          <Route path="/admin/product" element={<NewProduct/>}/>
          <Route path="/admin/product/:id" element = {<UpdateProduct/>}/>
          
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;


