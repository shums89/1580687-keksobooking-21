'use strict';

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
