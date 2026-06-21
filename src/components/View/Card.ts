import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ICardActions { onClick: (event: MouseEvent) => void; }

export class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;

    if (actions?.onClick) {
      if (this._button) this._button.addEventListener('click', actions.onClick);
      else container.addEventListener('click', actions.onClick);
    }
  }

  set title(value: string) { this._title.textContent = value; }

  set price(value: number | null) {
    this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    if (this._button) {
      if (!value) {
        this._button.setAttribute('disabled', 'disabled');
        this._button.textContent = 'Недоступно';
      } else {
        this._button.removeAttribute('disabled');
      }
    }
  }
}