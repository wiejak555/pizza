import { select, classNames, templates } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

  }

  renderInMenu() {
    const thisProduct = this;
    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }
  initOrderForm() {
    const thisProduct = this;
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });
    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.form);
    thisProduct.params = {};
    let price = thisProduct.data.price;
    for (let paramId in thisProduct.data.params) {
      const params = thisProduct.data.params[paramId];
      for (let optionId in params.options) {
        const option = params.options[optionId];

        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;

        const imgProduct = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        if (imgProduct) {
          if (optionSelected)
            imgProduct.classList.add(classNames.menuProduct.imageVisible);
          else imgProduct.classList.remove(classNames.menuProduct.imageVisible);
        }
        if (!thisProduct.params[paramId]) {
          thisProduct.params[paramId] = {
            label: paramId.label,
            options: {},
          };
        }
        thisProduct.params[paramId].options[optionId] = option.label;


        if (optionSelected && !option.default) {
          price += option.price;
        }
        else if (!optionSelected && option.default) {
          price -= option.price;
        }

      }

    }
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = thisProduct.price;
    //console.log(thisProduct.params)
  }
  initAccordion() {
    const thisProduct = this;
    thisProduct.accordionTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.element.classList.toggle('active');
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      for (let activeProduct of activeProducts) {
        if (activeProduct != thisProduct.element) {
          activeProduct.classList.remove('active');
        }
      }
    });
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('update', thisProduct.processOrder());

  }
  getElements() {
    const thisProduct = this;
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  addToCart() {
    const thisProduct = this;
    app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },

    });
    thisProduct.element.dispatchEvent(event);
  }
}
export default Product;

