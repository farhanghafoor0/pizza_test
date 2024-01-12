const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const menuSchema = new Schema({
    name: String,
    image: String,
    price: String,
    size: String
});


module.exports = mongoose.model('Menu', menuSchema);