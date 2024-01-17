const { models } = require("mongoose");

const Order = require("../../../models/order");

function orderController() {
  return {
    async index(req, res, next) {
      const orders = await Order.find({ status: { $ne: "completed" } }, null, {
        sort: { createdAt: -1 },
      }).populate("customerId", "-password");
      // console.log(orders);
      if (req.xhr) {
        return res.json(orders);
      }
      res.render("admin/orders");
    },

    async update(req, res, next) {
      //   Order.updateOne(
      //     { _id: req.body.orderId },
      //     { status: req.body.status },()=>{}
      //     );

      const { orderId, status } = req.body;
      const order = await Order.findOne({ _id: orderId });

      order.status = status;
      order.save();

      // Emit Event on status update
      const eventEmitter = req.app.get('eventEmitter');
      eventEmitter.emit('orderUpdated', { id: orderId, status: status});
      return res.redirect("/admin/orders");
    },
  };
}

module.exports = orderController;
