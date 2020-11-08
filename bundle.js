/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!*********************!*\
  !*** ./js/utils.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 500;
const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

// Склонение существительных
function getWordEnding(number, words) {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function setDisabled(collection, disabled = true) {
  collection.forEach((element) => {
    if (disabled) {
      element.setAttribute(`disabled`, ``);
    } else {
      element.removeAttribute(`disabled`);
    }
  });
}

function removeElements(collection) {
  collection.forEach((element) => {
    element.remove();
  });
}

function debounce(callback) {
  let lastTimeout = null;

  return function (...args) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      callback(...args);
    }, DEBOUNCE_INTERVAL);
  };
}

function getPhotoSrc(fileChooser, onSuccess) {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  if (FILE_TYPES.some((it) => fileName.endsWith(it))) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.addEventListener(`load`, () => onSuccess(reader.result));
  }
}

window.utils = {
  getWordEnding,
  setDisabled,
  removeElements,
  debounce,
  getPhotoSrc
};

})();

(() => {
/*!***********************!*\
  !*** ./js/network.js ***!
  \***********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const TIMEOUT_IN_MS = 10000;
const responseType = `json`;

const URLS = {
  get: `https://21.javascript.pages.academy/keksobooking/data`,
  post: `https://21.javascript.pages.academy/keksobooking`
};

const SERVER_CODE = {
  400: `Неверный запрос`,
  401: `Пользователь не авторизован`,
  404: `Ничего не найдено`,
  500: `Ошибка сервера`
};

function load(onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.timeout = TIMEOUT_IN_MS;

  xhr.addEventListener(`load`, () => {
    onSuccess(xhr.response);
  });

  xhr.addEventListener(`error`, () => {
    onError(SERVER_CODE[xhr.status] || `Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.open(`GET`, URLS.get);
  xhr.send();
}

function upload(data, onSuccess, onError) {
  const xhr = new XMLHttpRequest();

  xhr.responseType = `json`;
  xhr.timeout = TIMEOUT_IN_MS;

  xhr.addEventListener(`load`, function () {
    onSuccess(`Ваша заявка успешно отправлена`);
  });

  xhr.addEventListener(`error`, function () {
    onError(SERVER_CODE[xhr.status] || `Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.open(`POST`, URLS.post);
  xhr.send(data);
}

window.network = {
  load,
  upload
};

})();

(() => {
/*!**********************!*\
  !*** ./js/filter.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const mapFilters = document.querySelector(`.map`).querySelector(`.map__filters`);
const filterType = mapFilters.querySelector(`#housing-type`);
const filterPrice = mapFilters.querySelector(`#housing-price`);
const filterRooms = mapFilters.querySelector(`#housing-rooms`);
const filterGuests = mapFilters.querySelector(`#housing-guests`);
const filterFeatures = mapFilters.querySelector(`#housing-features`).querySelectorAll(`input[name="features"]`);

const HOUSING_PRICE = {
  'middle': {
    MIN: 10000,
    MAX: 50000
  },
  'low': {
    MIN: 0,
    MAX: 10000
  },
  'high': {
    MIN: 50000,
    MAX: Number.POSITIVE_INFINITY
  }
};

// Расчет кратчашего расстояния до метки (гипотенузы)
function getDistance(data) {
  const pinMainCoords = window.map.getCoordinats(false).split(`,`);

  return Math.sqrt(Math.abs(Math.pow(pinMainCoords[0] - data.location.x, 2) + Math.pow(pinMainCoords[1] - data.location.y, 2))
  );
}

// Поиск ближайщих меток к главной метке
function sortByDistance(data) {
  return data.sort(function (a, b) {
    return getDistance(a) - getDistance(b);
  });
}

function filterByType(element) {
  const value = element.offer.type;

  return (filterType.value === `any` || value === filterType.value);
}

function filterByPrice(element) {
  const value = element.offer.price;

  return (filterPrice.value === `any` || value >= HOUSING_PRICE[filterPrice.value].MIN && value <= HOUSING_PRICE[filterPrice.value].MAX);
}

function filterByRooms(element) {
  const value = String(element.offer.rooms);

  return (filterRooms.value === `any` || value === filterRooms.value);
}

function filterByGuests(element) {
  const value = String(element.offer.guests);

  return (filterGuests.value === `any` || value === filterGuests.value);
}

function filterByFeatures(element) {
  return [...filterFeatures].some((filter) => filter.checked && !element.offer.features.includes(filter.value));
}

function getFilterData(data) {
  const result = data.filter((element) =>
    filterByType(element) &&
    filterByPrice(element) &&
    filterByRooms(element) &&
    filterByGuests(element) &&
    !filterByFeatures(element)
  );

  return sortByDistance(result);
}

window.filter = {
  getFilterData
};

})();

(() => {
/*!********************!*\
  !*** ./js/data.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const ADS_DATA = {
  NUMBER_OF_ADS: 5,
  LOCATION_X: {
    min: 0,
    max: 0
  },
  LOCATION_Y: {
    min: 130,
    max: 630
  },
};

const TYPE_HOUSING = {
  bungalow: {
    minPrice: 0,
    translate: `Бунгало`
  },
  flat: {
    minPrice: 1000,
    translate: `Квартира`
  },
  house: {
    minPrice: 5000,
    translate: `Дом`
  },
  palace: {
    minPrice: 10000,
    translate: `Дворец`
  }
};

let loadedAds = [];

// Проверка интервала
function checkInterval(parameter, value) {
  if (value < ADS_DATA[parameter].min) {
    value = ADS_DATA[parameter].min;
  } else if (value > ADS_DATA[parameter].max) {
    value = ADS_DATA[parameter].max;
  }

  return value;
}

window.data = {
  ADS_DATA,
  TYPE_HOUSING,
  loadedAds,
  checkInterval
};

})();

(() => {
/*!*******************!*\
  !*** ./js/pin.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const TAG_SIZE = {
  width: 50,
  height: 70
};

const mapPins = document.querySelector(`.map`).querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

// Создание DOM-элемента для Фрагмента похожего объявления
function createPinElement(ad) {
  const pinElement = pinTemplate.cloneNode(true);
  const pinElementImg = pinElement.querySelector(`img`);

  pinElement.style = `left: ${ad.location.x - TAG_SIZE.width / 2}px; top: ${ad.location.y - TAG_SIZE.height}px;`;
  pinElementImg.src = ad.author.avatar;
  pinElementImg.alt = ad.offer.title;

  return pinElement;
}

// Создание Фрагмента похожего объявления
function createPinsFragment(arr) {
  const pinsFragment = document.createDocumentFragment();

  arr.slice(0, window.data.ADS_DATA.NUMBER_OF_ADS).forEach((element) => {
    const pinElement = createPinElement(element);

    pinElement.dataset.id = element.index;
    pinElement.dataset.name = `map_pin`;

    pinsFragment.appendChild(pinElement);
  });

  return pinsFragment;
}

function renderPins(arr) {
  removePins();
  window.card.removeCard();

  const pinsFragment = createPinsFragment(arr);

  mapPins.appendChild(pinsFragment);
}

function removePins() {
  const collection = mapPins.querySelectorAll(`button[data-name="map_pin"]`);

  window.utils.removeElements(collection);
}

function removeActivePin() {
  const activePin = document.querySelector(`.map__pin--active`);

  if (activePin) {
    activePin.classList.remove(`map__pin--active`);
  }
}

window.pin = {
  renderPins,
  removePins,
  removeActivePin
};

})();

(() => {
/*!********************!*\
  !*** ./js/card.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const map = document.querySelector(`.map`);
const mapPins = map.querySelector(`.map__pins`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const popupFeatureTemplate = cardTemplate.querySelector(`.popup__features`).querySelector(`.popup__feature`);
const popupPhotoTemplate = cardTemplate.querySelector(`.popup__photos`).querySelector(`.popup__photo`);

// Вывод количества комнат и гостей
function getTextRoomsAndGuests(ad) {
  let str = `${ad.offer.rooms} ${window.utils.getWordEnding(ad.offer.rooms, [`комната`, `комнаты`, `комнат`])} `;

  str += (ad.offer.guests) ?
    `для ${ad.offer.guests} ${window.utils.getWordEnding(ad.offer.guests, [`гостя`, `гостей`, `гостей`])}` :
    `без гостей`;

  return str;
}

// Создание Фрагмента доступных удобств
function createPopupFeaturesFragment(features) {
  const popupFeatureFragment = document.createDocumentFragment();

  features.forEach((feature) => {
    const popupFeatureElement = popupFeatureTemplate.cloneNode(true);
    popupFeatureElement.className = `popup__feature popup__feature--${feature}`;
    popupFeatureFragment.appendChild(popupFeatureElement);
  });

  return popupFeatureFragment;
}

// Создание Фрагмента фотографий
function createPopupPhotosFragment(photos) {
  const popupPhotoFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const popupPhotoElement = popupPhotoTemplate.cloneNode(true);
    popupPhotoElement.src = photo;
    popupPhotoFragment.appendChild(popupPhotoElement);
  });

  return popupPhotoFragment;
}

// Создание Фрагмента карточки объявления
function createCardElement(ad) {
  const cardElement = cardTemplate.cloneNode(true);

  const popupDescription = cardElement.querySelector(`.popup__description`);
  const popupFeatures = cardElement.querySelector(`.popup__features`);
  const popupPhotos = cardElement.querySelector(`.popup__photos`);

  cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
  cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = window.data.TYPE_HOUSING[ad.offer.type].translate;
  cardElement.querySelector(`.popup__text--capacity`).textContent = getTextRoomsAndGuests(ad);
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  // Необязательное поле, делаем проверку на наличие
  if (ad.offer.description) {
    popupDescription.textContent = ad.offer.description;
  } else {
    popupDescription.classList.add(`hidden`);
  }

  // Получение доступных удобств в карточке объявления, или скрытие данного блока
  if (ad.offer.features) {
    const popupFeatureFragment = createPopupFeaturesFragment(ad.offer.features);

    popupFeatures.innerHTML = ``;
    popupFeatures.appendChild(popupFeatureFragment);
  } else {
    popupFeatures.classList.add(`hidden`);
  }

  // Получение всех фотографий из списка photos или скрытие данного блока
  if (ad.offer.photos) {
    const popupPhotoFragment = createPopupPhotosFragment(ad.offer.photos);

    popupPhotos.innerHTML = ``;
    popupPhotos.appendChild(popupPhotoFragment);
  } else {
    popupPhotos.classList.add(`hidden`);
  }

  return cardElement;
}

function onCardPopupCloseClick(evt) {
  evt.target.removeEventListener(`click`, onCardPopupCloseClick);

  window.card.removeCard();
}

// Добавить карточку объявления
function renderCard(id) {
  const cardElement = createCardElement(window.data.loadedAds[id]);

  mapPins.after(cardElement);

  const card = map.querySelector(`.popup__close`);
  card.addEventListener(`click`, onCardPopupCloseClick);
}

// Удалить карточку объявления
function removeCard() {
  const card = map.querySelector(`article[class="map__card popup"]`);

  if (card) {
    card.remove();
  }
  window.pin.removeActivePin();
}

window.card = {
  renderCard,
  removeCard
};

})();

(() => {
/*!*******************!*\
  !*** ./js/map.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEFAULT_COORDINATES_PIN_MAIN = `left: 570px; top: 375px;`;

const map = document.querySelector(`.map`);
const mapPins = map.querySelector(`.map__pins`);
const mapPinMain = mapPins.querySelector(`.map__pin--main`);
const mapFilters = map.querySelector(`.map__filters`);
const mapFiltersHousings = mapFilters.querySelectorAll(`[id^="housing-"]`);

// Получить координаты элемента
function getCoordinats(isCenter = true) {
  const mapData = map.getBoundingClientRect();
  const mapPinMainData = mapPinMain.getBoundingClientRect();

  const x = Math.round(mapPinMainData.left - mapData.left + mapPinMainData.width / 2);
  const y = Math.round(mapPinMainData.top - mapData.top + (!isCenter && mapPinMain.scrollHeight || mapPinMainData.height / 2));

  return `${x}, ${y}`;
}

function setMapInactiveMode() {
  map.classList.add(`map--faded`);
  window.utils.setDisabled(mapFiltersHousings);

  window.data.loadedAds = [];

  mapFilters.reset();
  window.pin.removePins();
  window.card.removeCard();

  mapPinMain.style = DEFAULT_COORDINATES_PIN_MAIN;
  window.form.setAdFormAddress(getCoordinats(true));

  mapPins.removeEventListener(`click`, onMapPinsClick);
  mapPins.removeEventListener(`keydown`, onMapPinsKeydown);
  mapFilters.removeEventListener(`change`, onMapFiltersChange);
}

function saveLoadedAds(data) {
  window.data.loadedAds = [];

  data.forEach((element, i) => {
    if (element.offer) {
      element.index = i;
      window.data.loadedAds.push(element);
    }
  });

  updateMap();

  mapPins.addEventListener(`click`, onMapPinsClick);
  mapPins.addEventListener(`keydown`, onMapPinsKeydown);
  mapFilters.addEventListener(`change`, onMapFiltersChange);
}

function unloadAds(message) {
  window.modals.showDialogMessage(`error`, message, loadAds);
}

function loadAds() {
  window.network.load(saveLoadedAds, unloadAds);
}

function setMapActiveMode() {
  map.classList.remove(`map--faded`);
  window.utils.setDisabled(mapFiltersHousings, false);

  loadAds();
}

function onClickMap(evt) {
  const mapPin = evt.target.closest(`.map__pin:not(.map__pin--main)`);

  if (mapPin) {
    window.card.removeCard();
    mapPin.classList.add(`map__pin--active`);
    window.card.renderCard(mapPin.dataset.id);
  }
}

function updateMap() {
  window.form.setAdFormAddress(getCoordinats(false));
  window.pin.removePins();
  window.card.removeCard();

  const filteredData = window.filter.getFilterData(window.data.loadedAds);
  window.utils.debounce(window.pin.renderPins(filteredData));
}

function onMapPinsClick(evt) {
  if (evt.button === 0) {
    window.utils.debounce(onClickMap(evt));
  }
}

function onMapPinsKeydown(evt) {
  switch (evt.key) {
    case `Enter`:
      window.utils.debounce(onClickMap(evt));
      break;

    case `Escape`:
      evt.preventDefault();
      window.card.removeCard();
      break;
  }
}

function onMapFiltersChange() {
  const filteredData = window.filter.getFilterData(window.data.loadedAds);
  window.utils.debounce(window.pin.renderPins(filteredData));
}

window.map = {
  getCoordinats,
  updateMap,
  setMapInactiveMode,
  setMapActiveMode
};

})();

(() => {
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEFAULT_PHOTO = `img/muffin-grey.svg`;

const CAPACITY_VALIDITY = {
  '1': {
    values: [`1`],
    textError: `1 комната — «для 1 гостя»`
  },
  '2': {
    values: [`1`, `2`],
    textError: `для 2 гостей» или «для 1 гостя»`
  },
  '3': {
    values: [`1`, `2`, `3`],
    textError: `«для 3 гостей», «для 2 гостей» или «для 1 гостя»`
  },
  '100': {
    values: [`0`],
    textError: `«не для гостей»`
  }
};

const adForm = document.querySelector(`.ad-form`);
const buttonSubmit = adForm.querySelector(`.ad-form__submit`);
const buttonReset = adForm.querySelector(`.ad-form__reset`);
const fieldsets = adForm.querySelectorAll(`fieldset`);
const type = adForm.querySelector(`#type`);
const price = adForm.querySelector(`#price`);
const timein = adForm.querySelector(`#timein`);
const timeout = adForm.querySelector(`#timeout`);
const roomNumber = adForm.querySelector(`#room_number`);
const capacity = adForm.querySelector(`#capacity`);
const avatarUploadInput = adForm.querySelector(`.ad-form-header__upload input[type=file]`);
const avatarUploadPreview = adForm.querySelector(`.ad-form-header__upload .ad-form-header__preview img`);
const housingUploadInput = adForm.querySelector(`.ad-form__upload input[type=file]`);
const housingUploadPreview = adForm.querySelector(`.ad-form__photo`);

function checkType() {
  const typeValue = type.value;
  const newValue = window.data.TYPE_HOUSING[typeValue].minPrice;

  price.min = newValue;
  price.placeholder = newValue;
}

function checkTime() {
  const textValidityCapacity = (timeout.value === timein.value) ? `` : `Время выезда должно быть до ${timein.value}`;

  timeout.setCustomValidity(textValidityCapacity);
  timeout.reportValidity();
}

function checkRoomNumber() {
  const roomNumberValue = roomNumber.value;
  const capacityValue = capacity.value;

  const textValidityCapacity = (CAPACITY_VALIDITY[roomNumberValue].values.includes(capacityValue)) ? `` : CAPACITY_VALIDITY[roomNumberValue].textError;

  capacity.setCustomValidity(textValidityCapacity);
  capacity.reportValidity();
}

function resetAdForm() {
  price.min = 0;
  price.placeholder = 0;
  avatarUploadPreview.src = DEFAULT_PHOTO;
  housingUploadPreview.innerHTML = ``;

  adForm.reset();
  window.map.setMapInactiveMode();
  setFormInactiveMode();
}

function informSuccessUpload(message) {
  window.modals.showDialogMessage(`success`, message);
  resetAdForm();
}

function unloadAdForm(message) {
  window.modals.showDialogMessage(`error`, message, uploadAdForm);
}

function uploadAdForm() {
  window.network.upload(new FormData(adForm), informSuccessUpload, unloadAdForm);
}

function onButtonSubmitClick(evt) {
  checkType();
  checkTime();
  checkRoomNumber();

  if (adForm.checkValidity()) {
    evt.preventDefault();
    uploadAdForm();
  }
}

function onButtonResetClick(evt) {
  if (evt.button === 0) {
    evt.preventDefault();
    resetAdForm();
  }
}

function renderAvatarUploadPreview(src) {
  avatarUploadPreview.src = src;
}

function onAvatarUploadChange() {
  window.utils.getPhotoSrc(avatarUploadInput, renderAvatarUploadPreview);
}

function renderHousingUploadPreview(src) {
  housingUploadPreview.innerHTML = `<img src="${src}" alt="Фотография жилья" style="width: 100%; height: 100%; object-fit: contain">`;
}

function onHousingUploadChange() {
  window.utils.getPhotoSrc(housingUploadInput, renderHousingUploadPreview);
}

function setAdFormAddress(coordinats) {
  adForm.address.value = coordinats;
}

function setFormInactiveMode() {
  adForm.classList.add(`ad-form--disabled`);
  window.utils.setDisabled(fieldsets);

  buttonSubmit.removeEventListener(`click`, onButtonSubmitClick);
  buttonReset.removeEventListener(`click`, onButtonResetClick);
  avatarUploadInput.removeEventListener(`change`, onAvatarUploadChange);
  housingUploadInput.removeEventListener(`change`, onHousingUploadChange);
}

function setFormActiveMode() {
  adForm.classList.remove(`ad-form--disabled`);
  window.utils.setDisabled(fieldsets, false);

  buttonSubmit.addEventListener(`click`, onButtonSubmitClick);
  buttonReset.addEventListener(`click`, onButtonResetClick);
  avatarUploadInput.addEventListener(`change`, onAvatarUploadChange);
  housingUploadInput.addEventListener(`change`, onHousingUploadChange);
}

window.form = {
  setAdFormAddress,
  setFormInactiveMode,
  setFormActiveMode,
  uploadAdForm
};

})();

(() => {
/*!**********************!*\
  !*** ./js/modals.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


function showDialogMessage(selector, message = ``, callback) {
  const template = document.querySelector(`#${selector}`);

  function closeActiveDialogs() {
    window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

    document.removeEventListener(`click`, onDocumentClick);
    document.removeEventListener(`keydown`, onDocumentKeydown);
  }

  function onDocumentClick(evt) {
    closeActiveDialogs();

    if (callback && evt.target.matches(`button`)) {
      callback();
    }
  }

  function onDocumentKeydown(evt) {
    if (evt.key === `Escape`) {
      closeActiveDialogs();
    }
  }

  const element = template.content.querySelector(`.${selector}`).cloneNode(true);

  element.querySelector(`.${selector}__message`).textContent = message;
  element.classList.add(`user-message-active`);

  document.body.prepend(element);

  document.addEventListener(`click`, onDocumentClick);
  document.addEventListener(`keydown`, onDocumentKeydown);
}

window.modals = {
  showDialogMessage
};

})();

(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const LOCATION_X = `LOCATION_X`;
const LOCATION_Y = `LOCATION_Y`;

const map = document.querySelector(`.map`);
const mapPinMain = map.querySelector(`.map__pin--main`);

function updateLocationX() {
  const mapOverlay = document.querySelector(`.map__overlay`);

  window.data.ADS_DATA.LOCATION_X.min = 0 - mapPinMain.offsetWidth / 2;
  window.data.ADS_DATA.LOCATION_X.max = mapOverlay.offsetWidth - mapPinMain.offsetWidth / 2;
}

function onMapPinMainMousedown(evt) {
  if (evt.button !== 0) {
    return;
  }

  evt.preventDefault();

  let startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  function onMouseMove(moveEvt) {
    moveEvt.preventDefault();

    let shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    updateLocationX();

    mapPinMain.style.top = `${window.data.checkInterval(LOCATION_Y, mapPinMain.offsetTop - shift.y)}px`;
    mapPinMain.style.left = `${window.data.checkInterval(LOCATION_X, mapPinMain.offsetLeft - shift.x)}px`;
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);

    if (map.matches(`.map--faded`)) {
      window.map.setMapActiveMode();
      window.form.setFormActiveMode();
    } else {
      window.map.updateMap();
    }
  }

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
}

window.map.setMapInactiveMode();
window.form.setFormInactiveMode();

mapPinMain.addEventListener(`mousedown`, onMapPinMainMousedown);

})();

/******/ })()
;