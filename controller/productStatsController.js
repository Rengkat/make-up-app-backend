const Products = require("../model/productModel");
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

module.exports = { getProductStats };
