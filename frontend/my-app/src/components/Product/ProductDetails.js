import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import "./ProductDetails.css";
import { getProductDetails, newReview } from "../../actions/productAction.js";
import { useNavigate, useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import ReviewCard from "./ReviewCard.js";
import metadata from "../layout/metadata";
import { addItemsToCart } from "../../actions/cartAction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import Loader from "../layout/Loader/Loader";

const ProductDetails = () => {
  const dispatch = useDispatch();

  let { id } = useParams();

  const navigate = useNavigate();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const { isAuthenticated } = useSelector(state=> state.user);
  const { success } = useSelector((state) => state.newReview);
  console.log("product", product);

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQty = () => {
    if (product.stock <= quantity) {
      return;
    }
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    if(!isAuthenticated){
      navigate('/login');
    }
    toast.success("Item Added to your Cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated])

  useEffect(() => {
    // console.log('triggered')
    if (success) {
      toast.success("review submitted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, success]);

  const options = { 
    size: "large",
    value: product.rating,
    readOnly: true,
    precision: 0.5
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <metadata title={`${product.name}---ECOMMERCE`} />
          <div className="productDetails">
            <div>
              {/* <Carousel> */}
              {product.images &&
                product.images.map((item, i) => (
                  <img
                    src={item.url}
                    className="corouselImage"
                    key={item.url}
                    alt={`${i} image`}
                  />
                ))}
              {/* </Carousel> */}
            </div>

            <div>
              <div className="detailsBlock-1 pdetails">
                <h2>{product.name}</h2>
              </div>
              <div className="detailsBlock-2 pdetails">
                <Rating {...options} />

                <span>{product.numOfReviews} Reviews</span>
              </div>

              <div className="detailsBlock-3 pdetails">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQty}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQty}>+</button>
                  </div>
                  <button
                    disabled={product.stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "OutOfStock" : "InStock!!"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4 pdetails">
                Description: <p>{product.description}</p>
              </div>
              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>
          <h1 className="reviewsHeading">REVIEWS</h1>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet!</p>
          )}

          <ToastContainer />
        </>
      )}
    </>
  );
};

export default ProductDetails;
