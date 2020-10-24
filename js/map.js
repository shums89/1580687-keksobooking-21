'use strict';

(function () {

  const map = document.querySelector(`.map`);

  const mapPins = map.querySelector(`.map__pins`);
  const mapPinMain = mapPins.querySelector(`.map__pin--main`);
  const mapFilters = map.querySelector(`.map__filters`);

  const mapFiltersHousings = mapFilters.querySelectorAll(`[id^="housing-"]`);

  // Сбросить фильтры на карте
  function resetFilters(collection) {
    collection.forEach((element) => {
      switch (element.tagName) {
        case `SELECT`:
          element.value = `any`;
          break;
        case `INPUT`:
          element.checked = false;
          break;
      }
    });
  }

  // Получить координаты элемента
  function getCoordinats(isCenter = true) {
    const mapData = map.getBoundingClientRect();
    const mapPinMainData = mapPinMain.getBoundingClientRect();

    const x = Math.round(mapPinMainData.left - mapData.left + mapPinMainData.width / 2);
    const y = Math.round(mapPinMainData.top - mapData.top + (!isCenter && mapPinMain.scrollHeight || mapPinMainData.height / 2));

    return `${x}, ${y}`;
  }

  function setMapInactiveMode() {
    const mapFiltersFeatures = mapFilters.querySelector(`#housing-features`).querySelectorAll(`input[name="features"]`);

    map.classList.add(`map--faded`);
    window.utils.setDisabled(mapFiltersHousings);

    // Сбросить фильтры
    resetFilters(mapFiltersHousings);
    resetFilters(mapFiltersFeatures);

    // Очистить карту
    window.pin.removePins(map);
    window.card.removeCard(map);

    mapPinMain.style = `left: 570px; top: 375px;`;
    window.form.setAdFormAddress(getCoordinats(true));

    map.removeEventListener(`click`, onMapClick);
    map.removeEventListener(`keydown`, onMapKeydown);
  }

  function setMapActiveMode() {
    map.classList.remove(`map--faded`);
    window.utils.setDisabled(mapFiltersHousings, false);

    map.addEventListener(`click`, onMapClick);
    map.addEventListener(`keydown`, onMapKeydown);
  }

  function changeMap(evt) {
    const target = evt.target;
    const name = target.dataset.name || target.parentElement.dataset.name;

    switch (name) {
      case `map_pin`:
        const id = target.dataset.id || target.parentElement.dataset.id;

        window.card.removeCard(map);
        window.card.addCard(id, mapPins);
        break;
      case `map_card`:
        window.card.removeCard(map);
    }
  }

  function updateMap() {
    window.pin.removePins(map);
    window.card.removeCard(map);
    window.load.loadingData(window.data.filteringAds, window.modals.showErrorMessage);
  }

  function onMapClick(evt) {
    if (evt.button === 0) {
      changeMap(evt);
    }
  }

  function onMapKeydown(evt) {
    switch (evt.key) {
      case `Enter`:
        changeMap(evt);
        break;

      case `Escape`:
        evt.preventDefault();
        window.card.removeCard(map);
        break;
    }
  }

  window.map = {
    getCoordinats,
    updateMap,
    setMapInactiveMode,
    setMapActiveMode
  };

})();
