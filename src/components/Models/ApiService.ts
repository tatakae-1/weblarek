import {
  IApi,
  IProductsResponse,
  IOrderRequest,
  IOrderResponse
} from '../../types';

export class ApiService {

  constructor(
    private readonly api: IApi
  ) {}

  // Получение каталога товаров
  async loadProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  // Отправка данных заказа
  async submitOrder(
    order: IOrderRequest
  ): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(
      '/order/',
      order,
      'POST'
    );
  }
}

