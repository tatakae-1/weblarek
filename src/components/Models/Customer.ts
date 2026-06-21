import { IEvents } from '../base/Events';
import { IOrder } from '../../types';

export class Customer {
  protected data: IOrder = { payment: '', email: '', phone: '', address: '', total: 0, items: [] };
  protected formErrors: Partial<Record<keyof IOrder, string>> = {};

  constructor(protected events: IEvents) {}

  updateField(field: keyof IOrder, value: string) {
    (this.data as any)[field] = value;
    if (field === 'payment' || field === 'address') this.validateOrder();
    else this.validateContacts();
  }

  getCustomerData() { return this.data; }

  resetData() {
    this.data = { payment: '', email: '', phone: '', address: '', total: 0, items: [] };
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.data.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.data.address) errors.address = 'Необходимо указать адрес';
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.data.email) errors.email = 'Необходимо указать email';
    if (!this.data.phone) errors.phone = 'Необходимо указать телефон';
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}