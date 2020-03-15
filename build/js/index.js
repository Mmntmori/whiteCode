'use strict';

import data from './data.js';
document.addEventListener('DOMContentLoaded', function () {
  const catalog = document.querySelector('.catalog');
  let values = data.map(el => el);
  let shoppingCart = []; // Разбивает входной массив на подмассивы. Возвращается массив массивов.

  const setPages = arr => {
    let pagesArr = [];

    for (let i = 0; i < Math.ceil(arr.length / 15); i++) {
      let pageListArr = [];
      let count = 0;

      for (let j = 1; j <= 15; j++) {
        count = 15 * i + j;

        if (arr[count]) {
          pageListArr.push(arr[count]);
        } else {
          break;
        }
      }

      pagesArr.push(pageListArr);
    }

    return pagesArr;
  }; // Функция которая создаёт страницу на основе входного массива


  const createPageElement = (arr, i) => {
    const pageElement = document.createElement('div');
    const pageListElement = document.createElement('div');
    pageElement.classList.add('catalog__page'); // if (i === 1) {
    //     pageElement.classList.add('catalog__page--active');
    // }

    pageListElement.classList.add('catalog__list');
    pageElement.setAttribute('data-page-number', `${i}`);
    arr.forEach(function (el, i) {
      pageListElement.appendChild(createCatalogItem(el));
    });
    pageElement.appendChild(pageListElement);
    return pageElement;
  }; // Функция которая собирает каталог из страниц


  const createCatalogElement = arr => {
    const catalogElement = document.querySelector('.catalog');
    setPages(arr).forEach(function (el, i) {
      catalogElement.appendChild(createPageElement(el, i + 1));
    });
  };

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

  const createPagination = arr => {
    const paginationElement = document.querySelector('.catalog__count');

    for (let i = 1; i < setPages(arr).length; i++) {
      const paginationPageElement = document.createElement('a');
      paginationPageElement.classList.add('catalog__digit');
      paginationPageElement.innerText = i;
      paginationPageElement.setAttribute('href', '?page=' + i);
      paginationPageElement.addEventListener('click', function (event) {
        event.preventDefault();
        const alias = '?page=' + this.innerText;
        window.history.pushState(null, null, alias);
        const activePageAttribute = `[data-page-number="${this.innerText}"]`;
        const activePage = document.querySelector('.catalog__page' + activePageAttribute);
        const previousPage = document.querySelector('.catalog__page--active');

        if (previousPage) {
          previousPage.classList.remove('catalog__page--active');
        }

        activePage.classList.add('catalog__page--active');
      });
      paginationElement.appendChild(paginationPageElement);
    }
  };

  createCatalogElement(values);
  createPagination(values);

  function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
  }

  const active = document.querySelector('.catalog__page--active');

  if ($_GET('page') === false) {
    window.location.href = '?page=1';
  }

  if (active === null) {
    const currentPage = document.querySelector(`.catalog__page[data-page-number="${$_GET('page')}"]`);
    currentPage.classList.add('catalog__page--active');
  }
});