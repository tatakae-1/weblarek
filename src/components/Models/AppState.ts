import { IEvents } from '../base/Events';
import { IProduct, IOrder } from '../../types';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class AppState {
  catalog: IProduct[] = [];
  basket: IProduct[] = [];
  preview: IProduct | null = null;
  order: IOrder = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
  };
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {}

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.events.emit('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProduct) {
    this.preview = item;
    this.events.emit('preview:changed', item);
  }

  addToBasket(item: IProduct) {
    this.basket.push(item);
    this.updateBasket();
  }

  removeFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id);
    this.updateBasket();
  }

  clearBasket() {
    this.basket = [];
    this.updateBasket();
  }

  clearOrder() {
    this.order = {
      payment: '',
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: []
    };
  }

  updateBasket() {
    this.events.emit('basket:changed', this.basket);
  }

  getTotal() {
    return this.basket.reduce((a, c) => a + (c.price || 0), 0);
  }

  setOrderField(field: keyof IOrder, value: string) {
    (this.order as any)[field] = value;

    if (field === 'payment' || field === 'address') {
      this.validateOrder();
    } else {
      this.validateContacts();
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}