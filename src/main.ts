import './scss/styles.scss';

import { ApiService } from './components/Models/ApiService';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { AppState } from './components/Models/AppState';
import { IProduct, IOrder } from './types';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация брокера событий и API
const events = new EventEmitter();
const api = new ApiService(CDN_URL, API_URL);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных
const appData = new AppState(events);

// Глобальные компоненты представления
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты (Корзина и Формы)
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---

// 1. Изменение каталога
events.on('items:changed', () => {
  page.catalog = appData.catalog.map((item: IProduct) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category
    });
  });
});

// 2. Клик по карточке
events.on('card:select', (item: IProduct) => {
  appData.setPreview(item);
});

// 3. Отображение превью в модальном окне
events.on('preview:changed', (item: IProduct) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (appData.basket.find((el: IProduct) => el.id === item.id)) {
        appData.removeFromBasket(item.id);
      } else {
        appData.addToBasket(item);
      }
      events.emit('preview:changed', item);
    }
  });

  const isInBasket = appData.basket.find((el: IProduct) => el.id === item.id);
  card.buttonTitle = isInBasket ? 'Удалить из корзины' : 'Купить';

  modal.render({ content: card.render(item) });
});

// 4. Блокировка скролла при открытии модального окна
events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

// 5. Изменение корзины
events.on('basket:changed', () => {
  page.counter = appData.basket.length;
  basket.total = appData.getTotal();
  basket.items = appData.basket.map((item: IProduct, index: number) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => appData.removeFromBasket(item.id)
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: (index + 1).toString()
    });
  });
});

// 6. Открытие корзины
events.on('basket:open', () => {
  modal.render({ content: basket.render() });
});

// 7. Переход к первому шагу оформления заказа
events.on('order:open', () => {
  modal.render({
    content: order.render({
      payment: appData.order.payment,
      address: appData.order.address,
      valid: false,
      errors: []
    })
  });
});

// 8. Переход ко второму шагу оформления заказа
events.on('order:submit', () => {
  modal.render({
    content: contacts.render({
      email: appData.order.email,
      phone: appData.order.phone,
      valid: false,
      errors: []
    })
  });
});

// 9. Изменение полей в формах
events.on(/^order\..*:change/, (data: { field: keyof IOrder, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrder, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

// 10. Обновление ошибок валидации в формах
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { payment, address, email, phone } = errors;
  order.valid = !payment && !address;
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');

  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// 11. Отправка заказа на сервер
events.on('contacts:submit', () => {
  appData.order.total = appData.getTotal();
  appData.order.items = appData.basket.map((item: IProduct) => item.id);

  api.orderProducts(appData.order)
    .then((result: { total: number } | any) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        }
      });

      modal.render({ content: success.render({ total: result.total }) });

      // Очищаем корзину и данные форм после успешной оплаты
      appData.clearBasket();
      appData.clearOrder();
    })
    .catch((err: unknown) => {
      console.error(err);
    });
});

// 12. Запрос списка товаров с сервера при старте приложения
api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch((err: unknown) => {
    console.error(err);
  });