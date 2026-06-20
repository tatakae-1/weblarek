import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IOrderForm {
  address: string;
  payment: string;
}

export class OrderForm extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._buttons = Array.from(container.querySelectorAll('.button_alt'));
    this._buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.payment = button.name;
        this.events.emit('order.payment:change', { field: 'payment', value: button.name });
      });
    });
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }

  set payment(name: string) {
    this._buttons.forEach(button => {
      if (button.name === name) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }
}