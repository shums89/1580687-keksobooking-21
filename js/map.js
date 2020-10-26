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
    window.pin.removePins();
    window.card.removeCard();

    mapPinMain.style = `left: 570px; top: 375px;`;
    window.form.setAdFormAddress(getCoordinats(true));

    map.removeEventListener(`click`, onMapClick);
    map.removeEventListener(`keydown`, onMapKeydown);
    mapFilters.removeEventListener(`change`, onMapFiltersChange);
  }

  function setMapActiveMode() {
    map.classList.remove(`map--faded`);
    window.utils.setDisabled(mapFiltersHousings, false);

    window.network.load(window.data.saveLoadedAds, window.modals.showErrorMessage);

    map.addEventListener(`click`, onMapClick);
    map.addEventListener(`keydown`, onMapKeydown);
    mapFilters.addEventListener(`change`, onMapFiltersChange);
  }

  function changeMap(evt) {
    const target = evt.target;
    const name = target.dataset.name || target.parentElement.dataset.name;

    switch (name) {
      case `map_pin`:
        const id = target.dataset.id || target.parentElement.dataset.id;


        window.card.removeCard();
        window.card.addCard(id);

        mapPins.querySelector(`button[data-id="${id}"]`).classList.add(`map__pin--active`);

        break;

      case `map_card`:
        window.card.removeCard();
        break;
    }
  }

  function updateMap() {
    window.pin.removePins();
    window.card.removeCard();
    window.filter.filtering();
  }

  function onMapClick(evt) {
    if (evt.button === 0) {
      window.debounce(changeMap(evt));
    }
  }

  function onMapKeydown(evt) {
    switch (evt.key) {
      case `Enter`:
        window.debounce(changeMap(evt));
        break;

      case `Escape`:
        evt.preventDefault();
        window.card.removeCard();
        break;
    }
  }

  function onMapFiltersChange(evt) {
    const target = evt.target;
    const name = target.name || target.parentElement.name;

    switch (name) {
      case `housing-type`:
      case `housing-price`:
      case `housing-rooms`:
      case `housing-guests`:
        window.debounce(window.filter.filtering(name.split(`-`)[1], target.value));
        break;
      case `features`:
        window.debounce(window.filter.filtering(name, target.value, target.checked));
    }
  }

  window.map = {
    getCoordinats,
    updateMap,
    setMapInactiveMode,
    setMapActiveMode
  };

})();
