'use strict';

import data from './data.js';
document.addEventListener('DOMContentLoaded', function () {
  const catalogList = document.querySelector('.catalog__list');
  let values = data.map(el => el);
  let shoppingCart = [];

  const createCatalogItem = el => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('catalog-item');
    itemElement.appendChild(createImageElement(el));
    itemElement.appendChild(createDescElement(el));
    itemElement.appendChild(createActionElement(el));
    itemElement.setAttribute('id', `${el.id}`);
    return itemElement;
  };

  const createImageElement = el => {
    const itemImageElement = document.createElement('div');
    const itemImage = document.createElement('img');
    itemImageElement.classList.add('catalog-item__image');
    itemImageElement.appendChild(itemImage);
    itemImage.setAttribute('src', `${el.image}`);
    itemImage.setAttribute('alt', `${el.title}`);
    return itemImageElement;
  };

  const createDescElement = el => {
    const itemDescElement = document.createElement('div');
    const itemDescTitle = document.createElement('h3');
    const itemDescPrice = document.createElement('p');
    const itemDescText = document.createElement('p');
    itemDescElement.classList.add('catalog-item__desc');
    itemDescTitle.classList.add('catalog-item__title');
    itemDescPrice.classList.add('catalog-item__price');
    itemDescText.classList.add('catalot-item__text');
    itemDescTitle.innerText = el.title;
    itemDescText.innerText = el.desc;
    itemDescPrice.innerText = el.price + ' $';
    itemDescElement.appendChild(itemDescTitle);
    itemDescElement.appendChild(itemDescPrice);
    itemDescElement.appendChild(itemDescText);
    return itemDescElement;
  };

  const createActionElement = el => {
    const itemActionElement = document.createElement('div');
    const itemActionBtn = document.createElement('button');
    const itemActionBtnText = document.createElement('span');
    const itemActionCount = document.createElement('span');
    itemActionElement.classList.add('catalog-item__action');
    itemActionBtn.classList.add('catalog-item__btn');
    itemActionBtn.classList.add('primary-btn');
    itemActionCount.classList.add('catalog-item__added');

    if (el.avalable) {
      itemActionBtnText.innerText = 'Добавить в корзину';
      itemActionElement.appendChild(itemActionBtn);
    } else {
      itemActionBtnText.innerText = 'Нет в наличии';
      itemActionBtn.classList.add('primary-btn--disabled');
      itemActionElement.appendChild(itemActionBtn);
    }

    itemActionBtn.appendChild(itemActionBtnText);
    return itemActionElement;
  };

  values.forEach((el, i) => {
    catalogList.appendChild(createCatalogItem(el));
  });
});