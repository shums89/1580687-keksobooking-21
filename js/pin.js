'use strict';

const TAG_SIZE = {
  width: 50,
  height: 70
};

const mapPins = document.querySelector(`.map`).querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

// Создание DOM-элемента для Фрагмента похожего объявления
function createPinElement(ad) {
  const pinElement = pinTemplate.cloneNode(true);
  const pinElementImg = pinElement.querySelector(`img`);

  pinElement.style = `left: ${ad.location.x - TAG_SIZE.width / 2}px; top: ${ad.location.y - TAG_SIZE.height}px;`;
  pinElementImg.src = ad.author.avatar;
  pinElementImg.alt = ad.offer.title;

  return pinElement;
}

// Создание Фрагмента похожего объявления
function createPinsFragment(arr) {
  const pinsFragment = document.createDocumentFragment();

  arr.slice(0, window.data.ADS_DATA.NUMBER_OF_ADS).forEach((element) => {
    const pinElement = createPinElement(element);

    pinElement.dataset.id = element.index;
    pinElement.dataset.name = `map_pin`;

    pinsFragment.appendChild(pinElement);
  });

  return pinsFragment;
}

function renderPins(arr) {
  removePins();
  window.card.removeCard();

  const pinsFragment = createPinsFragment(arr);

  mapPins.appendChild(pinsFragment);
}

function removePins() {
  const collection = mapPins.querySelectorAll(`button[data-name="map_pin"]`);

  window.utils.removeElements(collection);
}

function removeActivePin() {
  const activePin = document.querySelector(`.map__pin--active`);

  if (activePin) {
    activePin.classList.remove(`map__pin--active`);
  }
}

window.pin = {
  renderPins,
  removePins,
  removeActivePin
};
