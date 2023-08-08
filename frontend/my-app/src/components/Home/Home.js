import React, { useEffect } from "react";

import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../layout/metadata";


import { getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
// import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// const product = {
//   name:'Shirt',
//   price: '3000',
//   images: [{url: 'https://4.imimg.com/data4/OX/VM/MY-35263749/men-s-casual-shirt-500x500.jpg'}],
//   _id: 'Adi'
// }

const Home = () => {
  // const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  console.log(products);

  useEffect(() => {
    if(error) {
      toast.error(error);
      return;
    }
    dispatch(getProduct());
    console.log("done");
  }, [dispatch]);

  return (
    <>
      
        <>
          <MetaData title="Home" />
          <div className="banner">
            <p>Welcome to Bettermart</p>
            <h1>Find amazing Products below!</h1>

            <a href="#container">
              <button>Scroll</button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => <Product product={product} />)}
          </div>
        </>

        <ToastContainer/>
      
    </>
  );
};

export default Home;
