const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
    email: req.user.email,
  });

  res.status(201).json({
    success: true,
    order,
  });

  const user = order.email;

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  const TrackOrder = `${req.protocol}://${req.get(
    "host"
  )}/orders/me`;

  // Get ResetPassword Token
  const message = `Thank You For Ordering With Being-Perky :- \n\n You have orderd ${order.orderItems.name}. \n you can track the order at ${TrackOrder}.\n We hope to serve u with our best intrests.`;

  try {
    await sendEmail({
      email: user,
      subject: `Registered SuccessFully`,
      message,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
