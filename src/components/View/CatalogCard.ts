import { Card, ICardActions } from './Card';
import { categoryMap } from '../../utils/constants'; // Ревьюер просил брать map отсюда!

export class CatalogCard extends Card<{ title: string; price: number | null; image: string; category: string }> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._image = container.querySelector(`.card__image`) as HTMLImageElement;
    this._category = container.querySelector(`.card__category`) as HTMLElement;
  }

  set image(value: string) {
    this._image.src = value;
    this._image.alt = this._title.textContent || '';
  }

  set category(value: string) {
    this._category.textContent = value;
    this._category.className = `card__category card__category_${categoryMap[value as keyof typeof categoryMap] || 'other'}`;
  }
}