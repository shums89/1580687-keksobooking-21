'use strict';

(function () {

  const map = document.querySelector(`.map`);

  const mapPins = map.querySelector(`.map__pins`);
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

    /* Добавить возврат mapPinMain на исходную позицию */

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
    let target = evt.target.closest(`button[class="map__pin"]`);
    if (target) {
      window.card.removeCard(map);
      window.card.addCard(target.dataset.id, mapPins);
      return;
    }

    target = evt.target.closest(`button[class="popup__close"]`);
    if (target) {
      window.card.removeCard(map);
    }
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
    setMapInactiveMode,
    setMapActiveMode
  };

})();
