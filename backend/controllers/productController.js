const Product = require("../models/productsModel");
const errorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/api_features");
const cloudinary = require("cloudinary");

//create a product -> use postman for api testng(as of now..)
module.exports.createProduct = async function (req, res) {
  try {
    //console.log("req.body", req.body);

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    console.log("img arr", images);

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
        width: 150,
        crop: "scale",
        public_id: `${Date.now()}`,
        resource_type: "auto",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    console.log(req.body.images);
    req.body.images = imagesLinks;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    console.log("error in creating a prod ", err);
    return;
  }
};

module.exports.getAllProducts = async function (req, res) {
  try {
    const resultPerPage = 4;

    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();

    // const productsQuery = apiFeature.query;
    const productsCount = await Product.countDocuments();

    apiFeature.pagination(resultPerPage);

    // const paginatedProducts = await productsQuery.limit(resultPerPage).skip(apiFeature.skip);
    const paginatedProducts = await apiFeature.query;

    return res.status(200).json({
      success: true,
      products: paginatedProducts,
      productsCount,
      resultPerPage,
      filteredProductsCount: paginatedProducts.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }


};

module.exports.getAdminProducts = async function (req, res) {
  try {
    const products = await Product.find();
    console.log("products", products);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.log("error in getting all the prod", err);
  }
};

//update product
module.exports.updateProduct = async function (req, res) {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "product not found",
      });
    }

    console.log("req.body", req.body);

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    console.log("img arr", images);

    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
          width: 150,
          crop: "scale",
          public_id: `${Date.now()}`,
          resource_type: "auto",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      console.log(req.body.images);
      req.body.images = imagesLinks;
    }

    // req.body.user = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

module.exports.deleteProduct = async function (req, res) {
  try {
    console.log("entered delete product controller");
    let product = await Product.findById(req.params.id);
    console.log("PRODUCT", product);
    if (!product) {
      return res.status(500).json({
        success: false,
      });
    }

    //deleting images from cloudinary

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    return res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

module.exports.getProductDetails = async function (req, res) {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(500).json({
      success: false,
    });
    // return next(new errorHandler("Product not found", 404));
  }

  return res.status(200).json({
    success: true,
    product,
  });
};

//create review or update(if already created)

module.exports.createProductReview = async function (req, res) {
  try {
    const review = {
      name: req.user.name,
      user: req.user._id,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    product = await Product.findById(req.body.productId);
    console.log(product);

    if (!product) {
      return res.status(401).json({
        message: "product not found",
      });
    }

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      for (rev of product.reviews) {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = req.body.rating;
          rev.comment = req.body.comment;
        }
      }
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.rating = product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.rating = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

module.exports.deleteReview = async function (req, res) {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    let newReviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.productId,
      toString()
    );

    let avg = 0;
    const rating = product.newReviews.forEach((rev) => {
      avg += rev.rating;
    });

    rating = avg / product.newReviews.length;
    let numOfReviews = newReviews.length;

    product = await Product.findByIdAndUpdate(req.query.productId, {
      reviews: newReviews,
      rating,
      numOfReviews,
    });

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

module.exports.getAllReviewsOfProduct = async function (req, res) {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "product not found",
      });
    }

    return res.status(200).json({
      success: true,
      productReviews: product.reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

// let productPerPage = 4;
// const productCount = await Product.countDocuments();
// try {
//   const apifeature = new ApiFeatures(Product.find(), req.query)
//     .search()
//     .filter()
//     .pagination(productPerPage)

//   let products = await apifeature.query;

//   // let filteredProductsCount = products.length;

//   products = await apifeature.query;

//   res.status(200).json({
//     success: true,
//     products,
//     productCount,
//     productPerPage,
//     filteredProductsCount,
//   });
// } catch (err) {
//   console.log("error in getting all the prod", err);
// }

// try {

//   const resultPerPage = 8;
//   const productsCount = await Product.countDocuments();

//   const apiFeature = new ApiFeatures(Product.find(), req.query)
//     .search()
//     .filter();

//   let products = await apiFeature.query;

//   let filteredProductsCount = products.length;

//   apiFeature.pagination(resultPerPage);

//   products = await apiFeature.query;

//   res.status(200).json({
//     success: true,
//     products,
//     productsCount,
//     resultPerPage,
//     filteredProductsCount,
//   });

//   } catch (error) {

//     return res.status(500).json({
//       error,
//     });

//   }






















// const resultPerPage = 8;

// const apiFeature = new ApiFeatures(Product.find(), req.query)
//   .search()
//   .filter();

// const productsQuery = apiFeature.query;
// const productsCount = await Product.countDocuments();

// apiFeature.pagination(resultPerPage);

// const paginatedProducts = await productsQuery.limit(resultPerPage).skip(apiFeature.skip);

// return res.status(200).json({
//   success: true,
//   products: paginatedProducts,
//   productsCount,
//   resultPerPage,
//   filteredProductsCount: paginatedProducts.length,
// });
// } catch (error) {
// return res.status(500).json({
//   success: false,
//   error: error.message,
// });
// }
