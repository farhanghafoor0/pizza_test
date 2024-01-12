const { models } = require("mongoose");

const Order = require('../../../models/order');

function orderController () {
    return {
        async index(req, res, next) {
            const orders = await Order.find( {status: {$ne: 'completed' }}, null, {sort: {'createdAt': -1}}).populate('customerId', '-password');
            // console.log(orders);
            if (req.xhr) {
                return res.json(orders);
            }
            res.render('admin/orders');
        }
    }
}





module.exports = orderController;