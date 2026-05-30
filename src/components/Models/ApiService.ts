import {
  IApi,
  IProduct,
  IProductsResponse,
  IOrderRequest,
  IOrderResponse
} from '../../types';

export class ApiService {

  constructor(
    private readonly api: IApi
  ) {}

  // Получение каталога товаров
  async loadProducts(): Promise<IProduct[]> {
    const response =
      await this.api.get<IProductsResponse>('/product/');

    return response.items;
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

