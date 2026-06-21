import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  saveProducts(products: IProduct[]) {
    this.products = products;
    this.events.emit('items:changed', this.products);
  }

  getProducts() { return this.products; }

  findProduct(id: string) { return this.products.find(item => item.id === id); }

  selectProduct(product: IProduct) {
    this.selectedProduct = product;
    this.events.emit('preview:changed', this.selectedProduct);
  }

  getSelectedProduct() { return this.selectedProduct; }
}