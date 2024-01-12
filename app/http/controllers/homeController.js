const Menu = require('../../models/menu')

function homeController() {
    return {
        async index(req, res, next) {
            const pizzas = await Menu.find();
            // console.log(pizzas);
            return res.render('home', {pizzas});
            // Menu.find().then(function(pizzas) {
            //     return res.render('home', {pizzas});

            // })
        }
    }
}


module.exports = homeController;