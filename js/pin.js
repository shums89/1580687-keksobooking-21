'use strict';

(function () {

  const mapPins = document.querySelector(`.map`).querySelector(`.map__pins`);
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  // Создание DOM-элемента для Фрагмента похожего объявления
  function createPinElement(ad) {
    const pinElement = pinTemplate.cloneNode(true);
    const pinElementImg = pinElement.querySelector(`img`);

    pinElement.style = `left: ${ad.location.x - window.data.ADS_DATA.TAG_SIZE.WIDTH / 2}px; top: ${ad.location.y - window.data.ADS_DATA.TAG_SIZE.HEIGHT}px;`;
    pinElementImg.src = ad.author.avatar;
    pinElementImg.alt = ad.offer.title;

    return pinElement;
  }

  // Создание Фрагмента похожего объявления
  function createPinsFragment() {
    const pinsFragment = document.createDocumentFragment();
    const data = window.data.filteredAds;
    const lengthMin = Math.min(window.data.ADS_DATA.NUMBER_OF_ADS, data.length);

    for (let i = 0; i < lengthMin; i++) {
      const pinElement = createPinElement(data[i]);
      pinElement.dataset.id = i;
      pinElement.dataset.name = `map_pin`;
      pinsFragment.appendChild(pinElement);
    }

    return pinsFragment;
  }

  // Добавление объявлений на карту
  function addPins() {
    window.pin.removePins();
    window.card.removeCard();

    const pinsFragment = createPinsFragment();

    mapPins.appendChild(pinsFragment);
  }

  // Удалить метки
  function removePins() {
    const collectionPin = mapPins.querySelectorAll(`button[data-name="map_pin"]`);

    window.utils.removeElements(collectionPin);
  }

  window.pin = {
    addPins,
    removePins
  };

})();
