import { IProduct } from "../../types";

export class Catalog {

  private catalogItems: IProduct[] = [];
  // Каталог товаров

  private currentProduct: IProduct | null = null;

  // Сохраняет список товаров
  saveProducts(products: IProduct[]): void {
    this.catalogItems = products;
  }

  // Возвращает все товары каталога
  getProducts(): IProduct[] {
    return this.catalogItems;
  }

  // поиск товара по id
  findProduct(id: string): IProduct | undefined {
    return this.catalogItems.find(item => item.id === id);
  }

  // Устанавливает активный товар
  selectProduct(product: IProduct): void {
    this.currentProduct = product;
  }

  // Возвращает выбранный товар
  getSelectedProduct(): IProduct | null {
    return this.currentProduct;
  }
}