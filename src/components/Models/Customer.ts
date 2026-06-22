import { IEvents } from '../base/Events';
import { IOrder } from '../../types';

export class Customer {
  protected data: IOrder = { payment: '', email: '', phone: '', address: '', total: 0, items: [] };

  constructor(protected events: IEvents) {}

  updateField(field: keyof IOrder, value: string) {
    (this.data as any)[field] = value;
    this.events.emit('customer:changed', this.data);
  }

  getCustomerData() { return this.data; }

  resetData() {
    this.data = { payment: '', email: '', phone: '', address: '', total: 0, items: [] };
    this.events.emit('customer:changed', this.data);
  }

  validateForm() {
    const errors: Partial<Record<keyof IOrder, string>> = {};
    if (!this.data.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.data.address) errors.address = 'Необходимо указать адрес';
    if (!this.data.email) errors.email = 'Необходимо указать email';
    if (!this.data.phone) errors.phone = 'Необходимо указать телефон';
    return errors;
  }
}