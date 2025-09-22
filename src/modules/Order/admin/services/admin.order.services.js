import Order from "../../../../DB/models/order.model.js";

export const orderPending = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const orders = await Order.find({ status: "pending" })
    .populate("userId", "name")
    .skip(offset)
    .limit(limit)
    .lean();
  const total = await Order.countDocuments({ status: "pending" });
  return res.status(200).json({
    pending_orders: orders,
    pages: Math.ceil(total / limit),
    page: page,
  });
};
export const orderconfirm = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const orders = await Order.find({ status: "confirmed" })
    .populate("userId", "name")
    .skip(offset)
    .limit(limit)
    .lean();
  const total = await Order.countDocuments({ status: "confirmed" });
  return res.status(200).json({
    confirmed_orders: orders,
    pages: Math.ceil(total / limit),
    page: page,
  });
};

export const ordersPerDay = async (req, res) => {
  const orders = await Order.aggregate([
    {
      $match: { status: "confimered" },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
        totalRevenue: { $sum: "$total_price" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
  ]);
  return res.status(200).json({ orders });
};
export const ordersPerMonth = async (req, res) => {
  const orders = await Order.aggregate([
    {
      $match: { status: "confimered" },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
        totalRevenue: { $sum: "$total_price" },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
  ]);
  return res.status(200).json({ orders });
};
