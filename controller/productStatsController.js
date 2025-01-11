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
const getProductsAddedOverTime = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    // Define the grouping period
    let dateGroup;
    if (groupBy === "day") {
      dateGroup = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (groupBy === "month") {
      dateGroup = { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } };
    } else if (groupBy === "year") {
      dateGroup = { year: { $year: "$createdAt" } };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid groupBy parameter. Use 'day', 'month', or 'year'.",
      });
    }

    const productData = await Products.aggregate([
      // Step 1: Filter products within the date range
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },

      // Step 2: Group products by the specified time period
      {
        $group: {
          _id: dateGroup,
          count: { $sum: 1 },
        },
      },

      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format the data for the frontend
    const formattedData = productData.map((item) => {
      const { year, month, day } = item._id;
      const dateLabel =
        groupBy === "day"
          ? `${year}-${month}-${day}`
          : groupBy === "month"
          ? `${year}-${month}`
          : `${year}`;
      return {
        date: dateLabel,
        count: item.count,
      };
    });

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductStats, getSalesByCategory };
