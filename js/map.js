'use strict';

const DEFAULT_COORDINATES_PIN_MAIN = `left: 570px; top: 375px;`;

const map = document.querySelector(`.map`);
const mapPins = map.querySelector(`.map__pins`);
const mapPinMain = mapPins.querySelector(`.map__pin--main`);
const mapFilters = map.querySelector(`.map__filters`);
const mapFiltersHousings = mapFilters.querySelectorAll(`[id^="housing-"]`);

// Получить координаты элемента
function getCoordinats(isCenter = true) {
  const mapData = map.getBoundingClientRect();
  const mapPinMainData = mapPinMain.getBoundingClientRect();

  const x = Math.round(mapPinMainData.left - mapData.left + mapPinMainData.width / 2);
  const y = Math.round(mapPinMainData.top - mapData.top + (!isCenter && mapPinMain.scrollHeight || mapPinMainData.height / 2));

  return `${x}, ${y}`;
}

function setMapInactiveMode() {
  map.classList.add(`map--faded`);
  window.utils.setDisabled(mapFiltersHousings);

  window.data.loadedAds = [];

  mapFilters.reset();
  window.pin.removePins();
  window.card.removeCards();

  mapPinMain.style = DEFAULT_COORDINATES_PIN_MAIN;
  window.form.setAdFormAddress(getCoordinats(true));

  mapPins.removeEventListener(`click`, onMapPinsClick);
  mapPins.removeEventListener(`keydown`, onMapPinsKeydown);
  mapFilters.removeEventListener(`change`, onMapFiltersChange);
}

function setMapActiveMode() {
  map.classList.remove(`map--faded`);
  window.utils.setDisabled(mapFiltersHousings, false);

  updateMap();

  mapPins.addEventListener(`click`, onMapPinsClick);
  mapPins.addEventListener(`keydown`, onMapPinsKeydown);
  mapFilters.addEventListener(`change`, onMapFiltersChange);
}

function changeMap(evt) {
  const mapPin = evt.target.closest(`button[class="map__pin"]`);

  if (mapPin) {
    window.card.removeCards();

    mapPin.classList.add(`map__pin--active`);
    window.card.renderCard();

    const card = map.querySelector(`.popup__close`);
    card.addEventListener(`click`, onCardPopupCloseClick);
  }
}

function updateMap() {
  window.pin.removePins();
  window.card.removeCards();
  window.utils.debounce(window.pin.renderPins(window.filter.filtering()));
}

function onMapPinsClick(evt) {
  if (evt.button === 0) {
    window.utils.debounce(changeMap(evt));
  }
}

function onMapPinsKeydown(evt) {
  switch (evt.key) {
    case `Enter`:
      window.utils.debounce(changeMap(evt));
      break;

    case `Escape`:
      evt.preventDefault();
      window.card.removeCards();
      break;
  }
}

function onMapFiltersChange() {
  window.utils.debounce(window.pin.renderPins(window.filter.filtering()));
}

function onCardPopupCloseClick(evt) {
  evt.target.removeEventListener(`click`, onCardPopupCloseClick);

  window.card.removeCards();
}

window.map = {
  getCoordinats,
  updateMap,
  setMapInactiveMode,
  setMapActiveMode
};
