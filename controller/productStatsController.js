const Products = require("../model/productModel");
const Orders = require("../model/orderModel");
const { StatusCodes } = require("http-status-codes");

const getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Products.countDocuments();

    const inStockProducts = await Products.countDocuments({ inventory: { $gt: 0 } });

    const lowStockProducts = await Products.countDocuments({ inventory: { $gt: 0, $lte: 10 } });

    const outOfStockProducts = await Products.countDocuments({ inventory: 0 });
    const productStats = [
      { name: "total products", counts: totalProducts },
      { name: "products in stock", counts: inStockProducts },
      { name: "low stock products", counts: lowStockProducts },
      { name: "out of stock products", counts: outOfStockProducts },
    ];

    res.status(StatusCodes.OK).json({
      success: true,
      data: productStats,
    });
  } catch (error) {
    next(error);
  }
};
const getSalesByCategory = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const salesData = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },

      // Step 2: Unwind the `orderItems` array to process each item
      { $unwind: "$orderItems" },

      // Step 3: Lookup the product details (category) from the `Products` collection
      {
        $lookup: {
          from: "products", // The collection name for products
          localField: "orderItems.product", // Field in the orderItems referencing the product ID
          foreignField: "_id", // Field in products referencing the product ID
          as: "productDetails",
        },
      },

      // Step 4: Unwind the `productDetails` array to flatten the data
      { $unwind: "$productDetails" },

      // Step 5: Group by category and time period (e.g., month)
      {
        $group: {
          _id: {
            category: "$productDetails.category",
            month: { $month: "$createdAt" }, // Extract month from the order date
            year: { $year: "$createdAt" }, // Extract year from the order date
          },
          totalSales: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.amount"] }, // Calculate total sales for the product
          },
          totalQuantity: { $sum: "$orderItems.amount" }, // Count total quantity sold
        },
      },

      // Step 6: Sort results by year, month, and category
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.category": 1 } },
    ]);

    res.status(StatusCodes.OK).json({ success: true, salesData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductStats, getSalesByCategory };
