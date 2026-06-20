import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

const categoryMap: Record<string, string> = {
  'софт-скил': 'soft',
  'другое': 'other',
  'дополнительное': 'additional',
  'кнопка': 'button',
  'хард-скил': 'hard'
};

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  title: string;
  description?: string;
  image?: string;
  price: number | null;
  category?: string;
  index?: string;
  buttonTitle?: string;
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

    this._image = container.querySelector(`.${blockName}__image`) as HTMLImageElement;
    this._category = container.querySelector(`.${blockName}__category`) as HTMLElement;
    this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }

    // Если у товара нет цены, блокируем кнопку и меняем текст
    if (this._button) {
      if (!value) {
        this._button.setAttribute('disabled', 'disabled');
        this._button.textContent = 'Недоступно';
      } else {
        this._button.removeAttribute('disabled');
      }
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      this._category.className = `card__category card__category_${categoryMap[value] || 'other'}`;
    }
  }

  set image(value: string) {
    if (this._image) {
      this._image.src = value;
      this._image.alt = this._title ? this._title.textContent || '' : '';
    }
  }
}

export class CardCatalog extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}

export class CardPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._description = ensureElement<HTMLElement>('.card__text', container);
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }

  set buttonTitle(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }
}

export class CardBasket extends Card {
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set index(value: string) {
    if (this._index) {
      this._index.textContent = value;
    }
  }
}