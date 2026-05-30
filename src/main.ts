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
cart.addProduct(apiProducts.items[0]);
cart.clearCart();
cart.removeProduct(apiProducts.items[0]);

console.log(
  'Корзина:',
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


console.log(
  'После удаления:',
  cart.getItems()
);

console.log(
  'После очистки корзины:',
  cart.getItems()
);

// Проверка покупателя
customer.updateField('email', 'test@mail.ru');
customer.updateField('phone', '+79999999999');
customer.updateField('address', 'Москва');
customer.updateField('payment', 'card');
customer.resetData();

console.log(
  'После очистки данных:',
  customer.getCustomerData()
);

console.log(
  'Данные покупателя:',
  customer.getCustomerData()
);

console.log(
  'Ошибки валидации:',
  customer.validateForm()
);

// test api
apiService
  .loadProducts()
  .then((products) => {
    catalog.saveProducts(products);

    console.log(
      'Каталог, полученный с сервера:',
      catalog.getProducts()
    );
  })
  .catch((error) => {
    console.error(error);
  });

