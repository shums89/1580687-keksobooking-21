'use strict';

(function () {

  const mapPins = document.querySelector(`.map`).querySelector(`.map__pins`);
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  // Создание DOM-элемента для Фрагмента похожего объявления
  function createPinElement(ad) {
    const pinElement = pinTemplate.cloneNode(true);
    const pinElementImg = pinElement.querySelector(`img`);

    pinElement.style = `left: ${ad.location.x - window.data.ADS_DATA.TAG_SIZE.width / 2}px; top: ${ad.location.y - window.data.ADS_DATA.TAG_SIZE.height}px;`;
    pinElementImg.src = ad.author.avatar;
    pinElementImg.alt = ad.offer.title;

    return pinElement;
  }

  // Создание Фрагмента похожего объявления
  function createPinsFragment(arr) {
    const pinsFragment = document.createDocumentFragment();

    arr.slice(0, window.data.ADS_DATA.NUMBER_OF_ADS).forEach((index) => {
      const pinElement = createPinElement(window.data.loadedAds[index]);

      pinElement.dataset.id = index;
      pinElement.dataset.name = `map_pin`;

      pinsFragment.appendChild(pinElement);
    });

    return pinsFragment;
  }

  // Добавление объявлений на карту
  function renderPins(arr) {
    removePins();
    window.card.removeCards();

    const pinsFragment = createPinsFragment(arr);

    mapPins.appendChild(pinsFragment);
  }

  // Удалить метки
  function removePins() {
    const collection = mapPins.querySelectorAll(`button[data-name="map_pin"]`);

    window.utils.removeElements(collection);
  }

  function removeActivePins() {
    const collection = document.querySelectorAll(`.map__pin--active`);

    collection.forEach((element) => {
      element.classList.remove(`map__pin--active`);
    });
  }

  window.pin = {
    renderPins,
    removePins,
    removeActivePins
  };

})();
