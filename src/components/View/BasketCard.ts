import { Card, ICardActions } from './Card';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends Card<{ title: string; price: number | null; index: string }> {
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set index(value: string) { this._index.textContent = value; }
}