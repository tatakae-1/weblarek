import { IProduct } from "../../types";

export class Cart {
  // Товары, добавленные пользователем в корзину
  private cartItems: IProduct[] = [];


  // Возвращает содержимое корзины
  getItems(): IProduct[] {
    return this.cartItems;
  }

  // Добавляет товар
  addProduct(product: IProduct): void {
    this.cartItems.push(product);
  }

  // Удаляет товар
  removeProduct(product: IProduct): void {
    this.cartItems = this.cartItems.filter(
      item => item.id !== product.id
    );
  }

  // Очищает корзину
  clearCart(): void {
    this.cartItems = [];
  }

  // Подсчитывает общую стоимость
  calculateTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price ?? 0),
      0
    );
  }

  // Возвращает количество товаров
  getItemsCount(): number {
    return this.cartItems.length;
  }

  // Проверяет наличие товара в корзине
  containsProduct(id: string): boolean {
    return this.cartItems.some(
      item => item.id === id
    );
  }
}