'use strict';

(function () {

  let loadedAds = [];

  const ADS_DATA = {
    NUMBER_OF_ADS: 5,
    TAG_SIZE: {
      width: 50,
      height: 70
    },
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
      if (element.offer) {
        element.restrictions = [];
        window.data.loadedAds.push(element);
      }
    });

    window.map.setMapActiveMode();
    window.form.setFormActiveMode();
  }

  function loadAds() {
    const ERROR = {
      onError: window.modals.showDialogMessage,
      callback: window.data.loadAds
    };
    window.network.load(window.data.saveLoadedAds, ERROR);
  }

  window.data = {
    ADS_DATA,
    TYPE_HOUSING,
    CAPACITY_VALIDITY,
    loadedAds,
    saveLoadedAds,
    loadAds
  };

})();
