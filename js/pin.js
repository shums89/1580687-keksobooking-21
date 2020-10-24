'use strict';

(function () {

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
  function createPinsFragment(ads) {
    const pinsFragment = document.createDocumentFragment();

    ads.forEach((ad, i) => {
      const pinElement = createPinElement(ad);
      pinElement.dataset.id = i;
      pinElement.dataset.name = `map_pin`;
      pinsFragment.appendChild(pinElement);
    });

    return pinsFragment;
  }

  // Добавление объявлений на карту
  function addPins(location) {
    const pinsFragment = createPinsFragment(window.data.ads);

    location.appendChild(pinsFragment);
  }

  // Удалить метки
  function removePins(location) {
    const collectionPin = location.querySelectorAll(`button[class="map__pin"]`);

    window.utils.removeElements(collectionPin);
  }

  window.pin = {
    addPins,
    removePins
  };

})();
