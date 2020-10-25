'use strict';

(function () {

  let loadedAds = [];
  let filteredAds = [];

  const mapOverlay = document.querySelector(`.map__overlay`);
  const mapPinMain = document.querySelector(`.map__pin--main`);

  const ADS_DATA = {
    NUMBER_OF_ADS: 5, // количество обьявлений
    TAG_SIZE: {
      WIDTH: 50,
      HEIGHT: 70
    }, // размеры метки map_pin
    LOCATION_X: {
      MIN: 0 - mapPinMain.offsetWidth / 2,
      MAX: mapOverlay.offsetWidth - mapPinMain.offsetWidth / 2
    }, // координата X метки на карте
    LOCATION_Y: {
      MIN: 130,
      MAX: 630
    }, // координата Y метки на карте
    URLS: {
      'GET': `https://21.javascript.pages.academy/keksobooking/data`,
      'POST': `https://21.javascript.pages.academy/keksobooking`
    }
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

  function saveLoadedAds(data) {
    window.data.loadedAds = [];

    data.forEach((element) => {
      element.matches = [];
      window.data.loadedAds.push(element);
    });

    window.map.updateMap();
  }

  window.data = {
    ADS_DATA,
    TYPE_HOUSING,
    CAPACITY_VALIDITY,
    loadedAds,
    filteredAds,
    saveLoadedAds
  };

})();
