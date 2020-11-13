'use strict';

const DEFAULT_COORDINATES_PIN_MAIN = `left: 570px; top: 375px;`;

const map = document.querySelector(`.map`);
const mapPins = map.querySelector(`.map__pins`);
const mapPinMain = mapPins.querySelector(`.map__pin--main`);
const mapFilters = map.querySelector(`.map__filters`);
const mapFiltersHousings = mapFilters.querySelectorAll(`[id^="housing-"]`);

// Получить координаты элемента
function getCoordinates(isCenter = true) {
  const mapData = map.getBoundingClientRect();
  const mapPinMainData = mapPinMain.getBoundingClientRect();

  const x = Math.round(mapPinMainData.left - mapData.left + mapPinMainData.width / 2);
  const y = Math.round(mapPinMainData.top - mapData.top + (!isCenter && mapPinMain.scrollHeight || mapPinMainData.height / 2));

  return `${x}, ${y}`;
}

function deactivateMap() {
  map.classList.add(`map--faded`);
  window.utils.setDisabled(mapFiltersHousings);

  window.data.loadedAds = [];

  mapFilters.reset();
  window.pin.removePins();
  window.card.removeCard();

  mapPinMain.style = DEFAULT_COORDINATES_PIN_MAIN;
  window.form.setAdFormAddress(getCoordinates(true));

  mapPins.removeEventListener(`click`, onMapPinsClick);
  mapPins.removeEventListener(`keydown`, onMapPinsKeydown);
  mapFilters.removeEventListener(`change`, onMapFiltersChange);
}

function saveLoadedAds(data) {
  window.data.loadedAds = [];

  data.forEach((element, i) => {
    if (element.offer) {
      element.index = i;
      window.data.loadedAds.push(element);
    }
  });

  updateMap();

  mapPins.addEventListener(`click`, onMapPinsClick);
  mapPins.addEventListener(`keydown`, onMapPinsKeydown);
  mapFilters.addEventListener(`change`, onMapFiltersChange);
}

function unloadAds(message) {
  window.modals.showDialogMessage(`error`, message, loadAds);
}

function loadAds() {
  window.network.load(saveLoadedAds, unloadAds);
}

function activateMap() {
  map.classList.remove(`map--faded`);
  window.utils.setDisabled(mapFiltersHousings, false);

  loadAds();
}

function onClickMap(evt) {
  const mapPin = evt.target.closest(`.map__pin:not(.map__pin--main)`);

  if (mapPin) {
    window.card.removeCard();
    mapPin.classList.add(`map__pin--active`);
    window.card.renderCard(mapPin.dataset.id);
  }
}

function updateMap() {
  window.form.setAdFormAddress(getCoordinates(false));
  window.pin.removePins();
  window.card.removeCard();

  const filteredData = window.filter.getFilterData(window.data.loadedAds);
  window.utils.debounce(window.pin.renderPins(filteredData));
}

function onMapPinsClick(evt) {
  if (evt.button === 0) {
    window.utils.debounce(onClickMap(evt));
  }
}

function onMapPinsKeydown(evt) {
  switch (evt.key) {
    case `Enter`:
      window.utils.debounce(onClickMap(evt));
      break;

    case `Escape`:
      evt.preventDefault();
      window.card.removeCard();
      break;
  }
}

function onMapFiltersChange() {
  const filteredData = window.filter.getFilterData(window.data.loadedAds);
  window.utils.debounce(window.pin.renderPins(filteredData));
}

window.map = {
  getCoordinates,
  updateMap,
  deactivateMap,
  activateMap
};
