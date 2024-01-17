require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require('path');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const expressSession = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const Emitter = require('events');


// Database Connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url);

const connection = mongoose.connection;

connection.on('error', (err) => {
    console.error('Connection failed...', err);
});

connection.once('open', () => {
    console.log('Database connected...');
});




// Session store in database
let mongoStore = MongoDbStore.create ({
    mongoUrl: url,
    collection: 'sessions',
    stringify: false // Add this line to fix the issue
});


// Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);


// Session Config
app.use(expressSession({
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours,
    
}));


// Passport config
const passportInit = require('./app/config/passport');
app.use(passport.initialize());
app.use(passport.session());
passportInit(passport);



app.use(flash());

// Assets
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( {extended: false } ));

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);


const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})






// Socket.io
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    // console.log(socket.id);
    socket.on('join', (orderId) => {
        socket.join(orderId)
        console.log(orderId)
        // console.log('usman')
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
});


io.on('connection', (socket) => {
    // console.log(socket.id);
    socket.on('join2', (admin_orders) => {
        socket.join(admin_orders)
        console.log(admin_orders)
        // console.log('farhan')
    })
})

eventEmitter.on('orderPlaced', (data) => {
    io.to(`admin_orders`).emit('orderPlaced', data)
});