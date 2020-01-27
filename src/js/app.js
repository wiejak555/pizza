import { Product } from './components/Product.js';
import { Cart } from './components/Cart.js';
import { select, settings } from './settings.js';



const app = {
  initMenu: function () {
    const thisApp = this;
    for (let productData in thisApp.data.products) {
      new Product(productData, thisApp.data.products[productData]);
    }
  },
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.amountWidget.db.url + '/' + settings.amountWidget.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      }).catch(function (error) {
        console.log(error);
      });
  },
  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListner('add-to-cart', function () {
      app.cart.add(event.detail.product);
    });
  },
  init: function () {
    const thisApp = this;


    thisApp.initData();
    thisApp.initCart();
  },
};

app.init();

