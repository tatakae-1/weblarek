import { CatalogCard } from './CatalogCard';
import { ensureElement } from '../../utils/utils';
import { ICardActions } from './Card';

export class PreviewCard extends CatalogCard {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    // Добавляем то, чего нет в CatalogCard
    this._description = ensureElement<HTMLElement>('.card__text', container);
  }

  set description(value: string) { this._description.textContent = value; }
  set buttonTitle(value: string) { if (this._button) this._button.textContent = value; }
}