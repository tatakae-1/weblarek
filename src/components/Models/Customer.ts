import { IBuyer } from "../../types";

export class Customer {

  private customerData: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: ''
  };

  // Обновляет выбранное поле
  updateField<K extends keyof IBuyer>(
    field: K,
    value: IBuyer[K]
  ): void {
    this.customerData[field] = value;
  }

  // Возвращает данные
  getCustomerData(): IBuyer {
    return this.customerData;
  }

  // Сбрасывает сохраненные данные
  resetData(): void {
    this.customerData = {
      payment: null,
      email: '',
      phone: '',
      address: ''
    };
  }

  // Выполняет проверку заполнения формы
  validateForm(): Record<string, string> {
    const validationErrors: Record<string, string> = {};

    if (!this.customerData.payment) {
      validationErrors.payment = 'Выберите способ оплаты';
    }

    if (!this.customerData.email) {
      validationErrors.email = 'Введите email';
    }

    if (!this.customerData.phone) {
      validationErrors.phone = 'Введите номер телефона';
    }

    if (!this.customerData.address) {
      validationErrors.address = 'Введите адрес доставки';
    }

    return validationErrors;
  }
}

