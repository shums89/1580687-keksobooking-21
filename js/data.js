'use strict';

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

let loadedAds = [];

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

function unloadAds(message) {
  window.modals.showDialogMessage(`error`, message, loadAds);
}

function loadAds() {
  window.network.load(window.data.saveLoadedAds, unloadAds);
}

window.data = {
  ADS_DATA,
  TYPE_HOUSING,
  loadedAds,
  saveLoadedAds,
  loadAds
};
