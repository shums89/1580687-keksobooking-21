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

// Создание массива уникальных элементов
function createUniqueList(arr) {
  const newSet = new Set();

  for (let i = 0; i < arr.length; i++) {
    newSet.add(getRandomElement(arr));
  }
  return [...newSet];
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
      features: createUniqueList(adsData.FEATURES),
      description: `Описание ${index + 1}`,
      photos: createUniqueList(adsData.PHOTOS)
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
function convertTypeHouse(english) {
  return {
    'palace': `Дворец`,
    'flat': `Квартира`,
    'house': `Дом`,
    'bungalow': `Бунгало`
  }[english];
}

// Получение списка доступных удобств в карточке объявления
function getCardAdFeatures(ad, cardAdElementFeatures) {
  let arrFeatures = ad.offer.features;

  for (let i = cardAdElementFeatures.length - 1; i >= 0; i--) {
    const child = cardAdElementFeatures[i];
    let isDelete = true;

    for (let j = 0; j < arrFeatures.length; j++) {
      if (child.getAttribute(`class`).indexOf(`popup__feature--${arrFeatures[j]}`) > 0) {
        arrFeatures.splice(j, 1);
        isDelete = false;
        break;
      }
    }

    if (isDelete) {
      child.remove();
    }
  }
}

// Получение фотографий в карточке объявления
function getCardAdPhotos(ad, cardAdElementPhotos) {
  const cardAdElementPhoto = cardAdElementPhotos.querySelector(`.popup__photo`);

  if (!ad.offer.photos.length) {
    cardAdElementPhoto.remove();
  } else if (ad.offer.photos.length === 1) {
    cardAdElementPhoto.src = ad.offer.photos[0];
  } else {
    cardAdElementPhoto.src = ad.offer.photos[0];

    for (let i = 1; i < ad.offer.photos.length; i++) {
      const newCardAdElementPhoto = cardAdElementPhoto.cloneNode(true);
      newCardAdElementPhoto.src = ad.offer.photos[i];

      cardAdElementPhotos.appendChild(newCardAdElementPhoto);
    }
  }
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

// Создание DOM-элемент для Фрагмента карточки объявления
function createElementCardAdFragment(ad, cardAdsTemplate) {
  const cardAdElement = cardAdsTemplate.cloneNode(true);

  cardAdElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
  cardAdElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardAdElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardAdElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  cardAdElement.querySelector(`.popup__type`).textContent = convertTypeHouse(ad.offer.type);
  cardAdElement.querySelector(`.popup__text--capacity`).textContent = getTextRoomsAndGuests(ad);
  cardAdElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  cardAdElement.querySelector(`.popup__description`).textContent = ad.offer.description;

  // Изменение списка доступных удобств в карточке объявления
  getCardAdFeatures(ad, cardAdElement.querySelector(`.popup__features`).querySelectorAll(`.popup__feature`));

  // Вывод всех фотографий из списка photos или удаление DOM-элемента, если нет фотографий
  getCardAdPhotos(ad, cardAdElement.querySelector(`.popup__photos`));

  return cardAdElement;
}

// Создание Фрагмента карточки объявления
function createCardAdFragment(ad) {
  const cardAdsTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const newFragment = document.createDocumentFragment();

  newFragment.appendChild(createElementCardAdFragment(ad, cardAdsTemplate));
  return newFragment;
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
