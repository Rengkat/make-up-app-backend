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
module.exports = { getOrderStats ,getAllOrdersOverTime};
