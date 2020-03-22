'use strict';

import data from './data.js';
document.addEventListener('DOMContentLoaded', function () {
  const sortByNameBtn = document.getElementById('sortByName');
  const sortByPriceBtn = document.getElementById('sortByPrice');
  const sortByAvailabilityBtn = document.getElementById('sortByAvailability');
  const denySortBtn = document.getElementById('denySortBtn');
  const listBackBtn = document.getElementById('listBackBtn');
  const listForwardBtn = document.getElementById('listForwardBtn');
  let values = data.map(el => el);
  let shoppingCart = getCartData() === null ? [] : getCartData();
  let sortByNameFlag = true;
  let sortByPriceFlag = true;
  let sortByAvailabilityFlag = true; //чтобы незабивать лишними массивами
  // localStorage.clear()
  // Получаем данные из LocalStorage

  function getCartData() {
    return JSON.parse(localStorage.getItem('shoppingCart'));
  } // Записываем данные в LocalStorage


  function setCartData(arr) {
    localStorage.setItem('shoppingCart', JSON.stringify(arr));
    return false;
  } // Разные алгоритмы для разных сортировок    


  function sortArrByPrice(arr) {
    let newArr = [...arr];

    if (sortByPriceFlag) {
      newArr.sort(function (a, b) {
        if (a.price > b.price) {
          return 1;
        } else if (a.price < b.price) {
          return -1;
        } else {
          return 0;
        }
      });
      sortByPriceFlag = false;
    } else {
      newArr.sort(function (a, b) {
        if (a.price < b.price) {
          return 1;
        } else if (a.price > b.price) {
          return -1;
        } else {
          return 0;
        }
      });
      sortByPriceFlag = true;
    }

    return newArr;
  }

  function sortArrByName(arr) {
    let newArr = [...arr];

    if (sortByNameFlag) {
      newArr.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        } else {
          return 0;
        }
      });
      sortByNameFlag = false;
    } else {
      newArr.sort(function (a, b) {
        if (a.title < b.title) {
          return 1;
        } else if (a.title > b.title) {
          return -1;
        } else {
          return 0;
        }
      });
      sortByNameFlag = true;
    }

    return newArr;
  }

  function sortArrByAvailability(arr) {
    let newArr = [...arr];

    if (sortByAvailabilityFlag) {
      newArr.sort(function (a, b) {
        if (a.avalable > b.avalable) {
          return 1;
        } else if (a.avalable < b.avalable) {
          return -1;
        } else {
          return 0;
        }
      });
      sortByAvailabilityFlag = false;
    } else {
      newArr.sort(function (a, b) {
        if (a.avalable < b.avalable) {
          return 1;
        } else if (a.avalable > b.avalable) {
          return -1;
        } else {
          return 0;
        }
      });
      sortByAvailabilityFlag = true;
    }

    return newArr;
  } // Разбивает входной массив на подмассивы. Возвращается массив массивов.


  const setPages = arr => {
    let thisArr = [...arr];
    let pagesArr = [];

    for (let i = 0; i < Math.ceil(thisArr.length / 15); i++) {
      let pageListArr = [];
      let count = 0;

      for (let j = 0; j < 15; j++) {
        count = 15 * i + j;

        if (arr[count]) {
          pageListArr.push(thisArr[count]);
        } else {
          break;
        }
      }

      pagesArr.push(pageListArr);
    }

    return pagesArr;
  }; // Функция которая создаёт страницу на основе входного массива


  const createPageElement = (arr, i, initArr) => {
    const pageElement = document.createElement('div');
    const pageListElement = document.createElement('div');
    pageElement.classList.add('catalog__page'); // if (i === 1) {
    //     pageElement.classList.add('catalog__page--active');
    // }

    pageListElement.classList.add('catalog__list');
    pageElement.setAttribute('data-page-number', `${i}`);
    arr.forEach(function (el, i) {
      pageListElement.appendChild(createCatalogItem(el, initArr));
    });
    pageElement.appendChild(pageListElement);
    return pageElement;
  }; // Функция которая собирает каталог из страниц


  const createCatalogElement = arr => {
    const catalogElement = document.querySelector('.catalog');
    setPages(arr).forEach(function (el, i) {
      catalogElement.appendChild(createPageElement(el, i + 1, arr));
    });
  };

  const createCatalogItem = (el, arr) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('catalog-item');
    itemElement.appendChild(createImageElement(el));
    itemElement.appendChild(createDescElement(el));
    itemElement.appendChild(createActionElement(el, arr));
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

  const disableListBtn = (arr = values) => {
    let lastPageNumber = setPages(arr).length.toString();

    if ($_GET('page') === '1') {
      listBackBtn.style.visibility = 'hidden';
      listForwardBtn.style.visibility = 'visible';
    } else if ($_GET('page') === lastPageNumber) {
      listForwardBtn.style.visibility = 'hidden';
      listBackBtn.style.visibility = 'visible';
    } else {
      listForwardBtn.style.visibility = 'visible';
      listBackBtn.style.visibility = 'visible';
    }
  };

  const listForward = () => {
    let currentPageNumber = parseInt($_GET('page'));
    let nextPageNumber = currentPageNumber + 1;
    const alias = '?page=' + nextPageNumber;
    window.history.pushState(null, null, alias);
    disableListBtn();
    showActivePage();
  };

  const listBack = () => {
    let currentPageNumber = parseInt($_GET('page'));
    let nextPageNumber = currentPageNumber - 1;
    const alias = '?page=' + nextPageNumber;
    window.history.pushState(null, null, alias);
    disableListBtn();
    showActivePage();
  };

  const createCartItemElement = obj => {
    const cartItemElement = document.createElement('div');
    const cartItemDeleteElement = document.createElement('div');
    const cartItemImageElement = document.createElement('div');
    const cartItemImage = document.createElement('img');
    const cartItemTitleElement = document.createElement('p');
    const cartItemCountElement = document.createElement('p');
    cartItemElement.classList.add('cart-item');
    cartItemElement.setAttribute('id', `${obj.id}`);
    cartItemElement.setAttribute('data-price', `${obj.price}`);
    cartItemDeleteElement.classList.add('cart-item__delete');
    cartItemDeleteElement.classList.add('delete-cart-item-btn');
    cartItemDeleteElement.addEventListener('click', function (e) {
      let cartItemId = e.target.parentNode.id;
      removeCartItem(cartItemId, shoppingCart, values);
      totalAmount();
    });
    cartItemImageElement.classList.add('cart-item__image');
    cartItemImage.setAttribute('src', `${obj.image}`);
    cartItemImage.setAttribute('alt', `${obj.title}`);
    cartItemTitleElement.classList.add('cart-item__title');
    cartItemTitleElement.innerText = obj.title;
    cartItemCountElement.classList.add('cart-item__count');
    cartItemCountElement.setAttribute('count', `${obj.count}`);
    cartItemCountElement.innerText = 'x ' + obj.count;
    cartItemElement.appendChild(cartItemDeleteElement);
    cartItemImageElement.appendChild(cartItemImage);
    cartItemElement.appendChild(cartItemImageElement);
    cartItemElement.appendChild(cartItemTitleElement);
    cartItemElement.appendChild(cartItemCountElement);
    return cartItemElement;
  };

  const createCartListElement = (arr, initArr) => {
    const cartListElement = document.getElementsByClassName('cart__list');
    let newArr = Object.values(arr);

    if (cartListElement.item(0).children.length === 0) {
      newArr.forEach((el, i) => {
        cartListElement.item(0).appendChild(createCartItemElement(el, initArr));
      });
    } else {
      cartListElement.item(0).innerHTML = '';
      newArr.forEach((el, i) => {
        cartListElement.item(0).appendChild(createCartItemElement(el, initArr));
      });
    }
  };

  const itemsGenerator = (arr, initArr) => {
    const items = [];
    initArr.forEach(element => {
      arr.forEach(item => {
        if (item === element.id) {
          items.push(element);
        }
      });
    });
    return items;
  };

  const countedItemsGenerator = arr => {
    const countedItems = {};
    arr.forEach(item => {
      if (!countedItems[item.id]) {
        countedItems[item.id] = { ...item,
          count: 1
        };
      } else {
        countedItems[item.id].count++;
      }
    });
    return countedItems;
  };

  const addToCartArr = (id, arr, initArr) => {
    if (id !== '') {
      if (arr !== null) {
        arr.push(id);
      } else {
        getCartData().push(id);
      }
    }

    setCartData(arr);
    createCartListElement(countedItemsGenerator(itemsGenerator(arr, initArr)));
  };

  const removeCartItem = (id, arr, initArr) => {
    if (id !== undefined) {
      if (arr !== null) {
        const index = arr.indexOf(id);

        if (index > -1) {
          arr.splice(index, 1);
        }
      } else {
        const index = getCartData().indexOf(id);

        if (index > -1) {
          getCartData().splice(index, 1);
        }
      }
    }

    setCartData(arr);
    createCartListElement(countedItemsGenerator(itemsGenerator(arr, initArr)));
  };

  addToCartArr("", shoppingCart, values);

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
    itemDescPrice.setAttribute('data-price', el.price);
    itemDescElement.appendChild(itemDescTitle);
    itemDescElement.appendChild(itemDescPrice);
    itemDescElement.appendChild(itemDescText);
    return itemDescElement;
  };

  const createActionElement = (el, arr) => {
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
      itemActionBtn.addEventListener('click', function () {
        let thisId = this.parentElement.parentElement.getAttribute('id');
        addToCartArr(thisId, shoppingCart, arr);
        totalAmount();
      });
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
    const arrPagesLenght = setPages(arr).length;

    for (let i = 1; i <= arrPagesLenght; i++) {
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
        disableListBtn(values);
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

  const showActivePage = () => {
    const active = document.querySelector('.catalog__page--active');

    if ($_GET('page') === false) {
      window.location.href = '?page=1';
    }

    if (active === null) {
      const currentPage = document.querySelector(`.catalog__page[data-page-number="${$_GET('page')}"]`);
      currentPage.classList.add('catalog__page--active');
    } else {
      active.classList.remove('catalog__page--active');
      const currentPage = document.querySelector(`.catalog__page[data-page-number="${$_GET('page')}"]`);
      currentPage.classList.add('catalog__page--active');
    }
  };

  disableListBtn();
  showActivePage();
  sortByNameBtn.addEventListener('click', function () {
    // document.getElementsByClassName('catalog').item(0). = '';
    const catalogPage = document.getElementsByClassName('catalog__page');
    const arr = [...catalogPage];
    arr.forEach(function (el, i) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    createCatalogElement(sortArrByName(values));
    showActivePage();
  });
  sortByPriceBtn.addEventListener('click', function () {
    // document.getElementsByClassName('catalog').item(0). = '';
    const catalogPage = document.getElementsByClassName('catalog__page');
    const arr = [...catalogPage];
    arr.forEach(function (el, i) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    createCatalogElement(sortArrByPrice(values));
    showActivePage();
  });
  sortByAvailabilityBtn.addEventListener('click', function () {
    // document.getElementsByClassName('catalog').item(0). = '';
    const catalogPage = document.getElementsByClassName('catalog__page');
    const arr = [...catalogPage];
    arr.forEach(function (el, i) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    createCatalogElement(sortArrByAvailability(values));
    showActivePage();
  });
  denySortBtn.addEventListener('click', function () {
    const catalogPage = document.getElementsByClassName('catalog__page');
    const arr = [...catalogPage];
    arr.forEach(function (el, i) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    createCatalogElement(values);
    showActivePage();
  });

  const totalAmount = () => {
    let totalPriceElement = document.getElementsByClassName('cart__digit');
    let cartItems = document.getElementsByClassName('cart-item');
    let cartItemsPrices = Array.from(cartItems);
    let sum = 0;

    for (let i = 0; i < cartItemsPrices.length; i++) {
      let thisPrice = cartItemsPrices[i].getAttribute('data-price');
      let thisItemCount = parseInt(cartItemsPrices[i].getElementsByClassName('cart-item__count').item(0).getAttribute('count'));
      sum += thisPrice * thisItemCount;
    }

    totalPriceElement.item(0).innerText = sum;
  };

  totalAmount();
  listForwardBtn.addEventListener('click', listForward);
  listBackBtn.addEventListener('click', listBack);
});