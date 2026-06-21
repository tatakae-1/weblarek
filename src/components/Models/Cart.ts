import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems() { return this.items; }

  addProduct(product: IProduct) {
    if (!this.containsProduct(product.id)) {
      this.items.push(product);
      this.events.emit('basket:changed', this.items);
    }
  }

  removeProduct(product: IProduct) {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('basket:changed', this.items);
  }

  clearCart() {
    this.items = [];
    this.events.emit('basket:changed', this.items);
  }

  calculateTotal() { return this.items.reduce((a, c) => a + (c.price || 0), 0); }

  getItemsCount() { return this.items.length; }

  containsProduct(id: string) { return this.items.some(item => item.id === id); }
}