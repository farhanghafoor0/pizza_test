import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res => {
        console.log(res);
        cartCounter.textContent = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "Item added to Cart"
          }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Something went wrong"
          }).show();
    })
}

addToCart.forEach(function(btn){
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        // console.log(pizza);
        updateCart(pizza);
    })
})


// Remove alert message after X seconds on /my-orders page
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
};


// This runs code from admin.js file
initAdmin();
