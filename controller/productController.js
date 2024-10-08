const Product = require("../model/productModel");
const Review = require("../model/reviewModel");
const CustomError = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const { StatusCodes } = require("http-status-codes");
const createProduct = async (req, res) => {
  await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "Product successfully added" });
};
const getAllProducts = async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice, sort, featured, bestSelling } = req.query;
    let query = {};

    // Filter logic
    if (featured) {
      query.featured = featured === "true";
    }
    if (bestSelling) {
      query.bestSelling = bestSelling === "true";
    }
    if (category) {
      query.category = category;
    }
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }
    if (minPrice && maxPrice) {
      query.price = { $gte: parseInt(minPrice, 10), $lte: parseInt(maxPrice, 10) };
    }

    // Fetch specific fields only (name, price, image, etc.)
    let result = Product.find(query, {
      name: 1,
      price: 1,
      image: 1,
      averageRating: 1,
      featured: 1,
      bestSelling: 1,
    })
      .populate("category", "name -_id")
      .populate("reviews", "rating -_id -product");

    // Sorting logic
    let sortQuery = {};
    if (sort) {
      switch (sort) {
        case "popularity":
          sortQuery.popularity = -1;
          break;
        case "highToLow":
          sortQuery.price = -1;
          break;
        case "lowToHigh":
          sortQuery.price = 1;
          break;
        case "rating":
          sortQuery.averageRating = -1;
          break;
        case "latest":
          sortQuery.createdAt = -1;
          break;
        default:
          break;
      }
    }

    // Apply sorting
    result = result.sort(sortQuery);

    // Pagination logic
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.limit(limit).skip(skip);

    // Fetch highest and lowest prices in the store
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          highestPrice: { $max: "$price" },
          lowestPrice: { $min: "$price" },
        },
      },
    ]);

    const highestPrice = priceStats.length > 0 ? priceStats[0].highestPrice : 0;
    const lowestPrice = priceStats.length > 0 ? priceStats[0].lowestPrice : 0;

    // Get the filtered products
    const products = await result;
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Response
    res.status(200).json({
      products,
      success: true,
      page,
      totalPages,
      totalProducts,
      highestPrice,
      lowestPrice,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId)
      .populate("reviews")
      .populate("category", "name -_id");
    if (!product) {
      throw new CustomError.BadRequestError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
const updateProduct = async (req, res, next) => {
  const { id: productId } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      throw new CustomError.NotFoundError(`No product with id ${productId}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ message: "Product successfully updated", success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      throw new CustomError.NotFoundError(`No product with id : ${productId}`);
    }
    await Review.deleteMany({ product: productId }); //remove all reviews of the product before deleting the product
    await Product.deleteOne({ _id: productId });
    res.status(StatusCodes.OK).json({ success: true, message: "Success! Product removed." });
  } catch (error) {
    next(error);
  }
};
const uploadImage = async (req, res, next) => {
  try {
    if (!req.files) {
      throw new CustomError.BadRequestError("No file uploaded");
    }
    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith("image")) {
      throw new CustomError.BadRequestError("Please upload an image");
    }
    const size = 1024 * 1024 * 5;
    if (productImage.size > size) {
      throw new CustomError.BadRequestError("Please upload image less than 5MB");
    }
    const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
      use_filename: true,
      folder: "Fullybeauty-images",
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    res.status(StatusCodes.CREATED).json({
      imageSrc: result.secure_url,
      success: true,
      message: "Image successfully uploaded",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
