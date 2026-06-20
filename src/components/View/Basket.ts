import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = []; // По умолчанию корзина пуста
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this._button.removeAttribute('disabled');
    } else {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Корзина пуста';
      this._list.replaceChildren(emptyMessage);

      // Если товаров нет, кнопка должна быть деактивирована
      this._button.setAttribute('disabled', 'disabled');
    }
  }

  set total(total: number) {
    this._total.textContent = `${total} синапсов`;
  }
}