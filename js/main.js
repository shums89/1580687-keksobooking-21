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
function getNewList(arr) {
  return arr.filter(() => getRandomInteger(0, 1));
}

// Создание объявления
function createAd(index, adsData) {
  const ad = {
    author: {
      avatar: `img/avatars/user0${index + 1}.png`,
    },
    offer: {
      title: `Заголовок ${index + 1}`,
      price: getRandomInteger(adsData.PRICE.MIN, adsData.PRICE.MAX),
      type: getRandomElement(adsData.TYPE),
      rooms: getRandomInteger(adsData.ROOMS.MIN, adsData.ROOMS.MAX),
      guests: getRandomInteger(adsData.GUESTS.MIN, adsData.GUESTS.MAX),
      checkin: getRandomElement(adsData.CHECKIN),
      checkout: getRandomElement(adsData.CHECKOUT),
      features: getNewList(adsData.FEATURES),
      description: `Описание ${index + 1}`,
      photos: getNewList(adsData.PHOTOS)
    },
    location: {
      x: getRandomInteger(adsData.LOCATION_X.MIN + adsData.TAG_SIZE.WIDTH / 2, adsData.LOCATION_X.MAX - adsData.TAG_SIZE.WIDTH / 2),
      y: getRandomInteger(adsData.LOCATION_Y.MIN + adsData.TAG_SIZE.HEIGHT, adsData.LOCATION_Y.MAX + adsData.TAG_SIZE.HEIGHT)
    }
  };
  ad.offer.address = `${ad.location.x}, ${ad.location.y}`;

  return ad;
}

// Получение массива объявлений
function getAds(adsData = ADS_DATA) {
  const ads = [];

  for (let i = 0; i < adsData.NUMBER_OF_ADS; i++) {
    ads.push(createAd(i, adsData));
  }
  return ads;
}

// Создание DOM-элемент для Фрагмента объявлений
function createElementAdsFragment(ad, adsTemplate, adsData = ADS_DATA) {
  const adElement = adsTemplate.cloneNode(true);

  adElement.style = `left: ${ad.location.x - adsData.TAG_SIZE.WIDTH / 2}px; top: ${ad.location.y - adsData.TAG_SIZE.HEIGHT}px;`;

  const adElementImg = adElement.querySelector(`img`);
  adElementImg.src = ad.author.avatar;
  adElementImg.alt = ad.offer.title;

  return adElement;
}

// Создание Фрагмента объявлений
function createAdsFragment(ads) {
  const adsTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const newFragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    newFragment.appendChild(createElementAdsFragment(ad, adsTemplate));
  });

  return newFragment;
}

// Конвертация англоязычного типа жилья в русскоязычный
function convertTypeHouse(lang) {
  return {
    'palace': `Дворец`,
    'flat': `Квартира`,
    'house': `Дом`,
    'bungalow': `Бунгало`
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
function createFeaturesFragment(features, featureTemplate) {
  const featuresFragment = document.createDocumentFragment();

  features.forEach(function (feature) {
    const featureElement = featureTemplate.cloneNode(true);
    featureElement.className = `popup__feature popup__feature--${feature}`;
    featuresFragment.appendChild(featureElement);
  });

  return featuresFragment;
}

// Получение списка доступных удобств в карточке объявления
function getListFeatures(features, parent) {
  const featuresElement = parent.querySelector(`.popup__features`);

  if (features) {
    const featuresFragment = createFeaturesFragment(features, featuresElement.querySelector(`.popup__feature`));

    while (featuresElement.firstChild) {
      featuresElement.removeChild(featuresElement.firstChild);
    }
    featuresElement.appendChild(featuresFragment);

  } else {
    featuresElement.classList.add(`hidden`);
  }
}

// Создание Фрагмента фотографий
function createPhotosFragment(photos, photoTemplate) {
  const photosFragment = document.createDocumentFragment();

  photos.forEach(function (photo) {
    const photoElement = photoTemplate.cloneNode(true);
    photoElement.src = photo;
    photosFragment.appendChild(photoElement);
  });

  return photosFragment;
}

// Получение фотографий в карточке объявления
function getListPhotos(photos, parent) {
  const photosElement = parent.querySelector(`.popup__photos`);

  if (photos) {
    const photoElement = photosElement.querySelector(`.popup__photo`);
    photoElement.replaceWith(createPhotosFragment(photos, photoElement));
  } else {
    photosElement.classList.add(`hidden`);
  }
}

// Создание DOM-элемента для Фрагмента карточки объявления
function createElementCardAdFragment(ad, cardAdTemplate) {
  const cardAdElement = cardAdTemplate.cloneNode(true);

  cardAdElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
  cardAdElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardAdElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardAdElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  cardAdElement.querySelector(`.popup__type`).textContent = convertTypeHouse(ad.offer.type);
  cardAdElement.querySelector(`.popup__text--capacity`).textContent = getTextRoomsAndGuests(ad);
  cardAdElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  cardAdElement.querySelector(`.popup__description`).textContent = ad.offer.description;

  // Получение списка доступных удобств в карточке объявления, или скрытие данного блока
  getListFeatures(ad.offer.features, cardAdElement);

  // Получение всех фотографий из списка photos или скрытие данного блока
  getListPhotos(ad.offer.photos, cardAdElement);

  return cardAdElement;
}

// Создание Фрагмента карточки объявления
function createCardAdFragment(ad) {
  const cardAdTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const cardAdFragment = document.createDocumentFragment();

  cardAdFragment.appendChild(createElementCardAdFragment(ad, cardAdTemplate));
  return cardAdFragment;
}

function main() {
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);

  // Генерация массива объявлений
  const ads = getAds();

  const adsListElement = map.querySelector(`.map__pins`);

  // Добавление объявлений на карту
  const adsFragment = createAdsFragment(ads);
  adsListElement.appendChild(adsFragment);

  // Добавление карточки первого объявления
  const cadrAdFragment = createCardAdFragment(ads[0]);
  adsListElement.after(cadrAdFragment);
}

main();
