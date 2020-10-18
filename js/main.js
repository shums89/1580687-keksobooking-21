'use strict';

const ADS_DATA = {
  NUMBER_OF_ADS: 8, // количество обьявлений
  TAG_SIZE: {WIDTH: 50, HEIGHT: 70}, // размеры метки
  PRICE: {MIN: 5000, MAX: 80000}, // стоимость от .. до ..
  TYPE: [`palace`, `flat`, `house`, `bungalow`], // тип помещения
  ROOMS: {MIN: 1, MAX: 4}, // количество комнат от .. до ..
  GUESTS: {MIN: 0, MAX: 5}, // количество гостей, которое можно разместить от .. до ..
  CHECKIN: [`12:00`, `13:00`, `14:00`], // время заезда
  CHECKOUT: [`12:00`, `13:00`, `14:00`], // время выезда
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`], // доп услуги
  PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
  LOCATION_X: {MIN: 0, MAX: 1200}, // координата x метки на карте от .. до ..
  LOCATION_Y: {MIN: 130, MAX: 630} // координата y метки на карте от 130 до 630
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


// Генерация случайного числа
function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

// Получение случайного элемента массива
function getRandomElement(arr) {
  return arr[getRandomInteger(0, arr.length - 1)];
}

// Получение нового массива
function getCorrectOrderList(arr) {
  return arr.filter(() => getRandomInteger(0, 1));
}

// Создание похожего объявления
function createAd(index) {
  const locationX = getRandomInteger(ADS_DATA.LOCATION_X.MIN + ADS_DATA.TAG_SIZE.WIDTH / 2, ADS_DATA.LOCATION_X.MAX - ADS_DATA.TAG_SIZE.WIDTH / 2);
  const locationY = getRandomInteger(ADS_DATA.LOCATION_Y.MIN + ADS_DATA.TAG_SIZE.HEIGHT, ADS_DATA.LOCATION_Y.MAX + ADS_DATA.TAG_SIZE.HEIGHT);

  return {
    author: {
      avatar: `img/avatars/user0${index + 1}.png`,
    },
    offer: {
      title: `Заголовок ${index + 1}`,
      address: `${locationX}, ${locationY}`,
      price: getRandomInteger(ADS_DATA.PRICE.MIN, ADS_DATA.PRICE.MAX),
      type: getRandomElement(ADS_DATA.TYPE),
      rooms: getRandomInteger(ADS_DATA.ROOMS.MIN, ADS_DATA.ROOMS.MAX),
      guests: getRandomInteger(ADS_DATA.GUESTS.MIN, ADS_DATA.GUESTS.MAX),
      checkin: getRandomElement(ADS_DATA.CHECKIN),
      checkout: getRandomElement(ADS_DATA.CHECKOUT),
      features: getCorrectOrderList(ADS_DATA.FEATURES),
      description: `Описание ${index + 1}`,
      photos: getCorrectOrderList(ADS_DATA.PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
}

// Получение массива похожих объявлений
function getAds() {
  const ads = [];

  for (let i = 0; i < ADS_DATA.NUMBER_OF_ADS; i++) {
    ads.push(createAd(i));
  }

  return ads;
}

// Создание DOM-элемента для Фрагмента похожего объявления
function createMapPinElement(ad) {
  const mapPinElement = mapPinTemplate.cloneNode(true);
  const mapPinElementImg = mapPinElement.querySelector(`img`);

  mapPinElement.style = `left: ${ad.location.x - ADS_DATA.TAG_SIZE.WIDTH / 2}px; top: ${ad.location.y - ADS_DATA.TAG_SIZE.HEIGHT}px;`;
  mapPinElementImg.src = ad.author.avatar;
  mapPinElementImg.alt = ad.offer.title;

  return mapPinElement;
}

// Создание Фрагмента похожего объявления
function createMapPinsFragment(ads) {
  const mapPinsFragment = document.createDocumentFragment();

  for (let i = 0; i < ads.length; i++) {
    const mapPinElement = createMapPinElement(ads[i]);
    mapPinElement.dataset.id = i;
    mapPinsFragment.appendChild(mapPinElement);
  }

  return mapPinsFragment;
}

// Склонение существительных
function getEnding(number, words) {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

// Вывод количества комнат и гостей
function getTextRoomsAndGuests(ad) {
  let str = `${ad.offer.rooms} ${getEnding(ad.offer.rooms, [`комната`, `комнаты`, `комнат`])} `;
  str += (ad.offer.guests) ? `для ${ad.offer.guests} ${getEnding(ad.offer.guests, [`гостя`, `гостей`, `гостей`])}` : `без гостей`;
  return str;
}

// Создание Фрагмента доступных удобств
function createPopupFeatureFragment(features) {
  const popupFeatureFragment = document.createDocumentFragment();

  features.forEach((feature) => {
    const popupFeatureElement = popupFeatureTemplate.cloneNode(true);
    popupFeatureElement.className = `popup__feature popup__feature--${feature}`;
    popupFeatureFragment.appendChild(popupFeatureElement);
  });

  return popupFeatureFragment;
}

// Создание Фрагмента фотографий
function createPopupPhotoFragment(photos) {
  const popupPhotoFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const popupPhotoElement = popupPhotoTemplate.cloneNode(true);
    popupPhotoElement.src = photo;
    popupPhotoFragment.appendChild(popupPhotoElement);
  });

  return popupPhotoFragment;
}

// Создание Фрагмента карточки объявления
function createMapCardElement(ad) {
  const mapCardElement = mapCardTemplate.cloneNode(true);

  const popupFeatures = mapCardElement.querySelector(`.popup__features`);
  const popupPhotos = mapCardElement.querySelector(`.popup__photos`);

  mapCardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
  mapCardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  mapCardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  mapCardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  mapCardElement.querySelector(`.popup__type`).textContent = TYPE_HOUSING[ad.offer.type].translate;
  mapCardElement.querySelector(`.popup__text--capacity`).textContent = getTextRoomsAndGuests(ad);
  mapCardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  // Необязательное поле, делаем проверку на наличие
  if (ad.offer.description) {
    mapCardElement.querySelector(`.popup__description`).textContent = ad.offer.description;
  } else {
    mapCardElement.classList.add(`hidden`);
  }

  // Получение доступных удобств в карточке объявления, или скрытие данного блока
  if (ad.offer.features) {
    const popupFeatureFragment = createPopupFeatureFragment(ad.offer.features);

    popupFeatures.innerHTML = ``;
    popupFeatures.appendChild(popupFeatureFragment);

  } else {
    popupFeatures.classList.add(`hidden`);
  }

  // Получение всех фотографий из списка photos или скрытие данного блока
  if (ad.offer.photos) {
    const popupPhotoFragment = createPopupPhotoFragment(ad.offer.photos);

    popupPhotos.innerHTML = ``;
    popupPhotos.appendChild(popupPhotoFragment);

  } else {
    popupPhotos.classList.add(`hidden`);
  }

  return mapCardElement;
}

// Настройка доступа
function setDisabled(collection, disabled = true) {
  collection.forEach((element) => {
    if (disabled) {
      element.setAttribute(`disabled`, ``);
    } else {
      element.removeAttribute(`disabled`);
    }
  });
}

// Установить неактивный режим
function setInactiveMode() {
  map.classList.add(`map--faded`);
  adForm.classList.add(`ad-form--disabled`);

  // Заблокировать ввод объявления
  setDisabled(adFormFieldsets);
  setDisabled(mapFiltersHousings);

  // Сбросить фильтры
  resetMapFilters(mapFiltersHousings);
  resetMapFilters(mapFiltersFeatures);
  // Добавить сброс полей ввода

  ads = [];
  // Очистить карту
  removeMapPin();
  removeMapCard();

  // Добавить возврат mapPinMain на исходную позицию
  address.value = getCoordinats(mapPinMain);

  adFormSubmit.removeEventListener(`click`, onAdFormSubmitClick);
  adFormReset.removeEventListener(`click`, onAdFormResetClick);
  adForm.removeEventListener(`change`, onAdFormChange);
}

// Установить активный режим
function setActiveMode() {
  if (map.matches(`.map--faded`)) {
    map.classList.remove(`map--faded`);
    adForm.classList.remove(`ad-form--disabled`);
    setDisabled(adFormFieldsets, false);
    setDisabled(mapFiltersHousings, false);

    adFormSubmit.addEventListener(`click`, onAdFormSubmitClick);
    adFormReset.addEventListener(`click`, onAdFormResetClick);
    adForm.addEventListener(`change`, onAdFormChange);
  }

  address.value = getCoordinats(mapPinMain, false);

  // Очистить карту
  removeMapPin();
  removeMapCard();

  // Генерация массива объявлений
  ads = getAds();

  // Добавление объявлений на карту
  const mapPinsFragment = createMapPinsFragment(ads);
  mapPins.appendChild(mapPinsFragment);
}

// Получить координаты элемента
function getCoordinats(element, isCenter = true) {
  const coordsMap = map.getBoundingClientRect();
  const coords = element.getBoundingClientRect();

  const x = Math.round(coords.left - coordsMap.x + coords.width / 2);
  const y = Math.round(coords.top - coordsMap.y + (!isCenter && mapPinMain.scrollHeight || coords.height / 2));

  return `${x}, ${y}`;
}

// Удалить метки на карте
function removeMapPin() {
  const collectionMapPin = mapPins.querySelectorAll(`button[class="map__pin"]`);

  if (collectionMapPin && collectionMapPin.length) {
    removeElements(collectionMapPin);
  }
}

// Удалить элементы
function removeElements(collection) {
  collection.forEach((element) => {
    element.remove();
  });
}

// Сбросить фильтры на карте
function resetMapFilters(collection) {
  collection.forEach((element) => {
    switch (element.tagName) {
      case `SELECT`:
        element.value = `any`;
        break;
      case `INPUT`:
        element.checked = false;
        break;
    }
  });
}

// Добавить карточку объявления
function addMapCard(index) {
  removeMapCard();

  // Добавление карточки первого похожего объявления
  const mapCardElement = createMapCardElement(ads[index]);
  mapPins.after(mapCardElement);
}

// Удалить карточку объявления
function removeMapCard() {
  const collectionMapCard = map.querySelectorAll(`article[class="map__card popup"]`);

  if (collectionMapCard && collectionMapCard.length) {
    removeElements(collectionMapCard);
  }
}

function checkType() {
  const typeValue = adFormType.value;
  const newValue = TYPE_HOUSING[typeValue].minPrice;

  adFormPrice.min = newValue;
  adFormPrice.placeholder = newValue;
}

function checkTime(element) {
  let textValidityTimein = ``;
  let textValidityTimeout = ``;

  if (adFormTimeout.value !== adFormTimein.value) {
    switch (element) {
      case `timein`:
        textValidityTimeout = `Время выезда должно быть до ${adFormTimein.value}`;
        break;
      case `timeout`:
        textValidityTimein = `Время заезда должно быть после ${adFormTimeout.value}`;
        break;
    }
  }

  adFormTimein.setCustomValidity(textValidityTimein);
  adFormTimeout.setCustomValidity(textValidityTimeout);

  adFormTimein.reportValidity();
  adFormTimeout.reportValidity();
}

function checkRoomNumber() {
  const roomNumberValue = adFormRoomNumber.value;
  const capacityValue = adFormCapacity.value;

  const textValidityCapacity = (CAPACITY_VALIDITY[roomNumberValue].values.includes(capacityValue)) ? `` : CAPACITY_VALIDITY[roomNumberValue].textError;

  adFormCapacity.setCustomValidity(textValidityCapacity);
  adFormCapacity.reportValidity();
}

function changeMap(evt) {
  let target = evt.target.closest(`button[class="map__pin map__pin--main"]`);
  if (target) {
    setActiveMode();
    return;
  }

  target = evt.target.closest(`button[class="map__pin"]`);
  if (target) {
    addMapCard(target.dataset.id);
    return;
  }

  target = evt.target.closest(`button[class="popup__close"]`);
  if (target) {
    removeMapCard();
  }
}


// ОБРАБОТЧИКИ СОБЫТИЙ

function onMapPinMainMousedown(evt) {
  if (evt.button === 0) {
    setActiveMode();
  }
}

function onAdFormSubmitClick() {
  // evt.preventDefault();
  // setInactiveMode
}

function onAdFormResetClick(evt) {
  if (evt.button === 0) {
    setInactiveMode();
  }
}

function onAdFormChange(evt) {
  const target = evt.target.id;

  switch (target) {
    case `type`:
      checkType();
      break;

    case `room_number`:
    case `capacity`:
      checkRoomNumber();
      break;

    case `timein`:
    case `timeout`:
      checkTime(target);
      break;
  }
}

function onMapClick(evt) {
  if (evt.button === 0) {
    changeMap(evt);
  }
}

function onMapKeydown(evt) {
  switch (evt.key) {
    case `Enter`:
      changeMap(evt);
      break;

    case `Escape`:
      evt.preventDefault();
      removeMapCard();
      break;
  }
}

// =====================================================================================

const map = document.querySelector(`.map`);
const adForm = document.querySelector(`.ad-form`);
const mapPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const mapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

const popupFeatureTemplate = mapCardTemplate.querySelector(`.popup__features`).querySelector(`.popup__feature`);
const popupPhotoTemplate = mapCardTemplate.querySelector(`.popup__photos`).querySelector(`.popup__photo`);

const mapPins = map.querySelector(`.map__pins`);
const mapPinMain = map.querySelector(`.map__pin--main`);
const mapFilters = map.querySelector(`.map__filters`);

const mapFiltersHousings = mapFilters.querySelectorAll(`[id^="housing-"]`);
const mapFiltersFeatures = mapFilters.querySelector(`#housing-features`).querySelectorAll(`input[name="features"]`);

const adFormFieldsets = adForm.querySelectorAll(`fieldset`);
const address = adForm.querySelector(`#address`);
const adFormType = adForm.querySelector(`#type`);
const adFormPrice = adForm.querySelector(`#price`);
const adFormTimein = adForm.querySelector(`#timein`);
const adFormTimeout = adForm.querySelector(`#timeout`);
const adFormRoomNumber = adForm.querySelector(`#room_number`);
const adFormCapacity = adForm.querySelector(`#capacity`);
const adFormSubmit = adForm.querySelector(`.ad-form__submit`);
const adFormReset = adForm.querySelector(`.ad-form__reset`);

let ads = [];

setInactiveMode();

mapPinMain.addEventListener(`mousedown`, onMapPinMainMousedown);
map.addEventListener(`click`, onMapClick);
map.addEventListener(`keydown`, onMapKeydown);
