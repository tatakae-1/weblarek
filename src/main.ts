import "./scss/styles.scss";


import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';
import { apiProducts } from "./utils/data";
import { Api } from './components/base/Api';
import { API_URL } from "./utils/constants";
import { ApiService } from './components/Models/ApiService';

const catalog = new Catalog();
const cart = new Cart();
const customer = new Customer();
const api = new Api(API_URL);
const apiService = new ApiService(api);

// Проверка каталога
catalog.saveProducts(apiProducts.items);
catalog.selectProduct(apiProducts.items[0]);

console.log(
  'Товары каталога:',
  catalog.getProducts()
);

console.log(
  'Товар по id:',
  catalog.findProduct(apiProducts.items[0].id)
);

console.log(
  'Выбранный товар:',
  catalog.getSelectedProduct()
);


// Проверка корзины

cart.addProduct(apiProducts.items[0]);
cart.addProduct(apiProducts.items[1]);

console.log(
  'Товары в корзине:',
  cart.getItems()
);

console.log(
  'Количество товаров:',
  cart.getItemsCount()
);

console.log(
  'Общая стоимость:',
  cart.calculateTotal()
);

console.log(
  'Товар есть в корзине:',
  cart.containsProduct(apiProducts.items[0].id)
);

// Удаление товара

cart.removeProduct(apiProducts.items[0]);

console.log(
  'После удаления товара:',
  cart.getItems()
);

// Очистка корзины

cart.clearCart();

console.log(
  'После очистки корзины:',
  cart.getItems()
);

// Проверка покупателя

customer.updateField('email', 'test@mail.ru');
customer.updateField('phone', '+79999999999');
customer.updateField('address', 'Москва');
customer.updateField('payment', 'card');

console.log(
  'Данные покупателя:',
  customer.getCustomerData()
);

console.log(
  'Ошибки валидации:',
  customer.validateForm()
);

// Очистка данных
customer.resetData();

console.log(
  'После очистки данных:',
  customer.getCustomerData()
);

console.log(
  'Ошибки после очистки:',
  customer.validateForm()
);

// test api
apiService.loadProducts()
  .then((data) => {
    catalog.saveProducts(data.items);

    console.log(catalog.getProducts());
  });

