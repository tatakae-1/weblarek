import './scss/styles.scss';
import { ApiService } from './components/Models/ApiService';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { IProduct, IOrder } from './types';

// Модели
import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { Customer } from './components/Models/Customer';

// View
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new ApiService(CDN_URL, API_URL);

// Инициализация моделей
const catalogModel = new Catalog(events);
const cartModel = new Cart(events);
const customerModel = new Customer(events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные компоненты
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты (Создаются строго один раз)
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderFormView = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsFormView = new ContactsForm(cloneTemplate(contactsTemplate), events);

// ИСПРАВЛЕНИЕ: Представление успеха создается единожды
const successView = new Success(cloneTemplate(successTemplate), {
  onClick: () => modal.close()
});

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// 1. Изменение каталога
events.on('items:changed', (items: IProduct[]) => {
  gallery.catalog = items.map(item => {
    const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
      onClick: () => catalogModel.selectProduct(item)
    });
    return card.render(item);
  });
});

// 2. Открытие превью товара
events.on('preview:changed', (item: IProduct) => {
  const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('product:toggle', item)
  });

  card.buttonTitle = cartModel.containsProduct(item.id) ? 'Удалить из корзины' : 'Купить';
  modal.render({ content: card.render(item) });
});

events.on('product:toggle', (item: IProduct) => {
  if (cartModel.containsProduct(item.id)) cartModel.removeProduct(item);
  else cartModel.addProduct(item);

  // Вызываем обновление превью для смены текста на кнопке карточки
  events.emit('preview:changed', item);
});

// 3. Изменение корзины
events.on('basket:changed', (items: IProduct[]) => {
  header.counter = cartModel.getItemsCount();
  basketView.total = cartModel.calculateTotal();

  basketView.items = items.map((item, index) => {
    const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => cartModel.removeProduct(item)
    });
    return card.render({ title: item.title, price: item.price, index: (index + 1).toString() });
  });
});

// 4. Открытие корзины
events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
});

// 5. Переход к первому шагу заказа
events.on('order:open', () => {
  modal.render({
    content: orderFormView.render({
      valid: false,
      errors: []
    })
  });
});

// 6. Переход ко второму шагу
events.on('order:submit', () => {
  modal.render({
    content: contactsFormView.render({
      valid: false,
      errors: []
    })
  });
});

// 7. Изменение полей в формах
events.on(/^order\..*:change/, (data: { field: keyof IOrder, value: string }) => {
  customerModel.updateField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrder, value: string }) => {
  customerModel.updateField(data.field, data.value);
});

// 8. Обновление ошибок валидации
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;
  orderFormView.valid = !payment && !address;
  orderFormView.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');

  contactsFormView.valid = !email && !phone;
  contactsFormView.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// 9. Отправка заказа
events.on('contacts:submit', () => {
  const orderData = customerModel.getCustomerData();
  orderData.total = cartModel.calculateTotal();
  orderData.items = cartModel.getItems().map(item => item.id);

  api.orderProducts(orderData)
    .then((result) => {
      // Рендерим окно успеха из глобальной переменной
      modal.render({ content: successView.render({ total: result.total }) });

      cartModel.clearCart();
      customerModel.resetData();

      // Очищаем формы визуально, чтобы они были пустыми для следующего заказа
      orderFormView.render({ payment: '', address: '', valid: false, errors: [] });
      contactsFormView.render({ email: '', phone: '', valid: false, errors: [] });
    })
    .catch(console.error);
});

// Запрос товаров при старте
api.getProductList().then(data => catalogModel.saveProducts(data)).catch(console.error);