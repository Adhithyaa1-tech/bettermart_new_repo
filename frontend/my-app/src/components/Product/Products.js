import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import "./Products.css";
import { useParams } from "react-router-dom";
// import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
// import Typography from "@material-ui/core/Typography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
// import './Pagination.css';

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [rating, setRating] = useState(0);

  const [category, setCategory] = useState("");

  const { products, loading, error, productsCount, productPerPage,  filteredProductsCount, } =
  useSelector((state) => state.products);

  const { keyword } = useParams();

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
    // dispatch(getProduct(keyword, pageNo, price, category, rating));
  };

  const handlePrice = (event, newPrice) => {
    setPrice(newPrice);
  };

  // const count = filteredProductsCount;

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  useEffect(() => {
    if(error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [dispatch, keyword, currentPage, price, category, rating, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <> 
          <metadata title='PRODUCTS---ECOMMERCE'/>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={handlePrice}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={rating}
                onChange={(e, newRating) => setRating(newRating)}
                aria-labelledby='continous-slider'
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>


          </div>

          {productsCount > productPerPage && (
            <div className="paginationBox">
              <ReactPaginate
                previousLabel="Prev"
                nextLabel="Next"
                breakLabel="..."
                breakClassName="break-me"
                pageCount={Math.ceil(productsCount / productPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={4}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
              />
            </div>
           )} 

         

    

         
        </>
      )}
      <ToastContainer/>
    </>
  );
};

export default Products;
