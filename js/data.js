'use strict';

(function () {

  let ads = [];

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

  // Создание похожего объявления
  function createAd(index) {
    const locationX = window.utils.getRandomInteger(ADS_DATA.LOCATION_X.MIN + ADS_DATA.TAG_SIZE.WIDTH / 2, ADS_DATA.LOCATION_X.MAX - ADS_DATA.TAG_SIZE.WIDTH / 2);
    const locationY = window.utils.getRandomInteger(ADS_DATA.LOCATION_Y.MIN + ADS_DATA.TAG_SIZE.HEIGHT, ADS_DATA.LOCATION_Y.MAX + ADS_DATA.TAG_SIZE.HEIGHT);

    return {
      author: {
        avatar: `img/avatars/user0${index + 1}.png`,
      },
      offer: {
        title: `Заголовок ${index + 1}`,
        address: `${locationX}, ${locationY}`,
        price: window.utils.getRandomInteger(ADS_DATA.PRICE.MIN, ADS_DATA.PRICE.MAX),
        type: window.utils.getRandomElement(ADS_DATA.TYPE),
        rooms: window.utils.getRandomInteger(ADS_DATA.ROOMS.MIN, ADS_DATA.ROOMS.MAX),
        guests: window.utils.getRandomInteger(ADS_DATA.GUESTS.MIN, ADS_DATA.GUESTS.MAX),
        checkin: window.utils.getRandomElement(ADS_DATA.CHECKIN),
        checkout: window.utils.getRandomElement(ADS_DATA.CHECKOUT),
        features: window.utils.getCorrectOrderList(ADS_DATA.FEATURES),
        description: `Описание ${index + 1}`,
        photos: window.utils.getCorrectOrderList(ADS_DATA.PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  // Получение массива похожих объявлений
  function createAds() {
    window.data.ads = [];

    for (let i = 0; i < ADS_DATA.NUMBER_OF_ADS; i++) {
      window.data.ads.push(createAd(i));
    }
  }

  window.data = {
    ADS_DATA,
    TYPE_HOUSING,
    CAPACITY_VALIDITY,
    ads,
    createAds
  };

})();
