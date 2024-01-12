const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");



const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');

function initRoutes (app) {
    app.get("/", homeController().index);

    app.get("/cart", cartController().index);
    
    app.post("/update-cart", cartController().update);

    
    
    app.get("/register", guest, authController().register);
    app.post("/register", authController().postRegister);
    
    app.get("/login", guest, authController().login);
    app.post("/login", authController().postLogin);

    app.get("/logout", authController().logout);

    // Customer Routes
    app.post("/orders", auth, orderController().store);
    app.get("/my-orders", auth, orderController().index);
    
    
    // Admin Routes
    app.get("/admin/orders", admin, AdminOrderController().index);

    
};

module.exports = initRoutes;