export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | null;

// Информация о товаре
export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
}

// Данные покупателя
export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

// Ответ сервера со списком товаров
export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

// Данные для создания заказа
export interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
}

// Ответ после успешного оформления заказа
export interface IOrderResponse {
    id: string;
    total: number;
}