'use strict';

function onMapPinMainMousedown(evt) {
  if (evt.button === 0) {
    // Установить активный режим
    if (map.matches(`.map--faded`)) {
      window.map.setMapActiveMode();
      window.form.setFormActiveMode();
    }

    window.form.setAdFormAddress(window.utils.getCoordinats(mapPinMain, map, false));
    window.pin.removePins(map);
    window.card.removeCard(map);
    window.data.createAds();
    window.pin.addPins(map);
  }
}

const map = document.querySelector(`.map`);
const mapPinMain = map.querySelector(`.map__pin--main`);

window.form.setAdFormAddress(window.utils.getCoordinats(mapPinMain, map, true));

mapPinMain.addEventListener(`mousedown`, onMapPinMainMousedown);
