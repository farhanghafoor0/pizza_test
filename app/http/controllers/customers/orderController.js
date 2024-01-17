const { models } = require("mongoose");

const Order = require("../../../models/order");

function orderController() {
  return {
    store(req, res, next) {
      // Validate request
      const { phone, address } = req.body;

      if (!phone || !address) {
        req.flash("error", "All fields are required");
        return res.redirect("/cart");
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
      });

      order
        .save()
        .then(async (result) => {
          let placedOrder = await Order.populate(result, { path: "customerId" });
          // Emit Event on placing order
          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("orderPlaced", placedOrder);

          req.flash("success", "Order placed successfully");
          delete req.session.cart;
          return res.redirect("/my-orders");
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/cart");
        });

      // console.log(req.body)
    },
    async index(req, res, next) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      // console.log(orders);
      res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
      );
      res.render("customers/orders", { orders });
    },
    async singleOrder(req, res, next) {
      const order = await Order.findById(req.params.orderid);
      // console.log(order);
      // console.log(req.user._id);

      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order });
      }
      return res.redirect("/");
    },
  };
}

module.exports = orderController;
