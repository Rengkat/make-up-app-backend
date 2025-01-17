const User = require("../model/userModel");
const Appointments = require("../model/appointmentModel");
const Orders = require("../model/orderModel");
const { StatusCodes } = require("http-status-codes");
const getOrderStats = async (req, res, next) => {
  try {
    //all orders
    const totalOrders = await Orders.countDocuments();
    //completed others
    const ordersCategory = await Orders.aggregate([
      {
        $group: {
          _id: "$deliveryStatus",
          count: { $sum: 1 },
        },
      },
    ]);
    const formatted = ordersCategory.map((order)=>{
  return{
    status:order._id,
    count:order.count
  }
})
  const orderStatus=[...formatted,{status:"total", count:totalOrders}]
  res.status(StatusCodes.OK).json({ success: true, orderStatus });
  } catch (error) {
    next(error);
  }
};
const getAllOrdersOverTime = async(req, res, next)=>{
  try {
    const monthlySales = await Orders.aggregate([
      
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$total" },
        },
      },
      // Sort by year and month in descending order
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    // Array to map numeric months to names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format the response to include month names
    const formattedData = monthlySales.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1],
      totalSales: item.totalSales|| 0,
    }));

    res.status(StatusCodes.OK).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
}
const getBestSaleProduct = async (req, res, next) => {
  try {
    const bestSelling = await Orders.aggregate([
      {
        
        $match: { status: "paid" },
      },
      {
    
        $unwind: "$orderItems",
      },
      {
       
        $group: {
          _id: "$orderItems.name",
          totalSold: { $sum: "$orderItems.amount" }, 
        },
      },
      {
       
        $sort: { totalSold: -1 },
      },
      {
       
        $limit: 10,
      },
    ]);
const formatted=bestSelling.map((product)=>{
  return{productName:product._id, totalSold:product.totalSold|| 0}
})
    res.status(StatusCodes.OK).json({ success: true, bestSelling:formatted });
  } catch (error) {
    next(error);
  }
};
const getTotalRevenue= async(req, res, next)=>{
 try {
    const monthlySales = await Orders.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = monthlySales.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1],
      totalRevenue: item.totalRevenue|| 0,
    }));

    res.status(StatusCodes.OK).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }

}
const getAverageOrderValue = async (req, res, next) => {
  try {
    const result = await Orders.aggregate([
      {
        // Filter to include only completed/paid orders (if applicable)
        $match: { status: "paid" },
      },
      {
       
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }, 
          totalOrders: { $sum: 1 },        
        },
      },
      {
        // Calculate the Average Order Value
        $project: {
          _id: 0, // Exclude the _id field
          averageOrderValue: {
            $divide: ["$totalRevenue", "$totalOrders"], // totalRevenue / totalOrders
          },
        },
      },
    ]);

 
    res.status(StatusCodes.OK).json({
      success: true,
      data: result[0]?.averageOrderValue || 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOrderStats ,getAllOrdersOverTime, getBestSaleProduct,getTotalRevenue,getAverageOrderValue};
