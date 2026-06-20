import { Api } from '../base/Api';
import { IOrder, IProduct } from './AppState';

export interface IOrderResult {
  id: string;
  total: number;
}

export class ApiService extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    // Передаем baseUrl в родительский класс Api
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // Получить список товаров с сервера
  getProductList(): Promise<IProduct[]> {
    return this.get<{ total: number, items: IProduct[] }>('/product').then((data) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  // Отправить заказ на сервер
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>('/order', order).then(
      (data) => data
    );
  }
}