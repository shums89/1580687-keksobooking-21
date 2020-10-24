'use strict';

function onMapPinMainMousedown(evt) {
  if (evt.button === 0) {
    // Установить активный режим
    if (map.matches(`.map--faded`)) {
      window.map.setMapActiveMode();
      window.form.setFormActiveMode();
    }

    window.form.setAdFormAddress(window.map.getCoordinats(mapPinMain, false));
    window.pin.removePins(map);
    window.card.removeCard(map);
    window.data.getAds();
  }
}

const map = document.querySelector(`.map`);
const mapPinMain = map.querySelector(`.map__pin--main`);

window.form.setAdFormAddress(window.map.getCoordinats(mapPinMain, true));

mapPinMain.addEventListener(`mousedown`, onMapPinMainMousedown);
