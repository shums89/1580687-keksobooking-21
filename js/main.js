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
function createMapPinFragmentElement(ad) {
  const mapPinElement = mapPinTemplate.cloneNode(true);
  const mapPinElementImg = mapPinElement.querySelector(`img`);

  mapPinElement.style = `left: ${ad.location.x - ADS_DATA.TAG_SIZE.WIDTH / 2}px; top: ${ad.location.y - ADS_DATA.TAG_SIZE.HEIGHT}px;`;
  mapPinElementImg.src = ad.author.avatar;
  mapPinElementImg.alt = ad.offer.title;

  return mapPinElement;
}

// Создание Фрагмента похожего объявления
function createMapPinFragment(ads) {
  const mapPinFragment = document.createDocumentFragment();

  ads.forEach((ad) => {
    const mapPinFragmentElement = createMapPinFragmentElement(ad);
    mapPinFragment.appendChild(mapPinFragmentElement);
  });

  return mapPinFragment;
}

// Конвертация англоязычного типа жилья в русскоязычный
function convertTypeHouse(lang) {
  return {
    palace: `Дворец`,
    flat: `Квартира`,
    house: `Дом`,
    bungalow: `Бунгало`
  }[lang];
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
function createPopupFeatureFragment(features, popupFeatureTemplate) {
  const popupFeatureFragment = document.createDocumentFragment();

  features.forEach((feature) => {
    const popupFeatureElement = popupFeatureTemplate.cloneNode(true);
    popupFeatureElement.className = `popup__feature popup__feature--${feature}`;
    popupFeatureFragment.appendChild(popupFeatureElement);
  });

  return popupFeatureFragment;
}

// Создание Фрагмента фотографий
function createPopupPhotoFragment(photos, popupPhotoTemplate) {
  const popupPhotoFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const popupPhotoElement = popupPhotoTemplate.cloneNode(true);
    popupPhotoElement.src = photo;
    popupPhotoFragment.appendChild(popupPhotoElement);
  });

  return popupPhotoFragment;
}

// Создание Фрагмента карточки объявления
function createMapCardFragment(ad) {
  const mapCardFragment = document.createDocumentFragment();
  const mapCardElement = mapCardTemplate.cloneNode(true);

  const popupFeatures = mapCardElement.querySelector(`.popup__features`);
  const popupFeatureTemplate = popupFeatures.querySelector(`.popup__feature`);
  const popupPhotos = mapCardElement.querySelector(`.popup__photos`);
  const popupPhotoTemplate = popupPhotos.querySelector(`.popup__photo`);

  mapCardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
  mapCardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  mapCardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  mapCardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  mapCardElement.querySelector(`.popup__type`).textContent = convertTypeHouse(ad.offer.type);
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
    const popupFeatureFragment = createPopupFeatureFragment(ad.offer.features, popupFeatureTemplate);

    popupFeatures.innerHTML = ``;
    popupFeatures.appendChild(popupFeatureFragment);

  } else {
    popupFeatures.classList.add(`hidden`);
  }

  // Получение всех фотографий из списка photos или скрытие данного блока
  if (ad.offer.photos) {
    const popupPhotoFragment = createPopupPhotoFragment(ad.offer.photos, popupPhotoTemplate);

    popupPhotos.innerHTML = ``;
    popupPhotos.appendChild(popupPhotoFragment);

  } else {
    popupPhotos.classList.add(`hidden`);
  }

  mapCardFragment.appendChild(mapCardElement);

  return mapCardFragment;
}


const map = document.querySelector(`.map`);
const mapPins = map.querySelector(`.map__pins`);
const mapPinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const mapCardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

map.classList.remove(`map--faded`);

// Генерация массива похожих объявлений
const ads = getAds();

// Добавление объявлений на карту
const mapPinFragment = createMapPinFragment(ads);
mapPins.appendChild(mapPinFragment);

// Добавление карточки первого похожего объявления
const mapCardFragment = createMapCardFragment(ads[0]);
mapPins.after(mapCardFragment);
