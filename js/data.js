'use strict';

(function () {

  let ads = [];

  const ADS_DATA = {
    NUMBER_OF_ADS: 8, // количество обьявлений
    TAG_SIZE: {
      WIDTH: 50,
      HEIGHT: 70
    }, // размеры метки
    LOCATION_X: {
      MIN: 0,
      MAX: 1200
    }, // координата x метки на карте от .. до ..
    LOCATION_Y: {
      MIN: 130,
      MAX: 630
    } // координата y метки на карте от 130 до 630
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

  // Получение массива похожих объявлений
  function createAds(adsData) {
    window.data.ads = [];

    for (let i = 0; i < ADS_DATA.NUMBER_OF_ADS; i++) {
      window.data.ads.push(adsData[i]);
    }

    window.pin.addPins(document.querySelector(`.map`));
  }

  window.data = {
    ADS_DATA,
    TYPE_HOUSING,
    CAPACITY_VALIDITY,
    ads,
    getAds() {
      window.load.loadingData(createAds, window.utils.showErrorLoading);
    }
  };

})();
