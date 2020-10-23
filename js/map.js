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

  // Получить координаты элемента
  function getCoordinats(element, isCenter = true) {
    const mapData = map.getBoundingClientRect();
    const elementData = element.getBoundingClientRect();

    const x = Math.round(elementData.left - mapData.left + elementData.width / 2);
    const y = Math.round(elementData.top - mapData.top + (!isCenter && element.scrollHeight || elementData.height / 2));

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
    setMapInactiveMode,
    setMapActiveMode
  };

})();
