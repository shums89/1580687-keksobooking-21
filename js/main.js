'use strict';

(function () {

  const map = document.querySelector(`.map`);
  const mapPinMain = map.querySelector(`.map__pin--main`);

  function updateLocationX() {
    const mapOverlay = document.querySelector(`.map__overlay`);

    window.data.ADS_DATA.LOCATION_X.min = 0 - mapPinMain.offsetWidth / 2;
    window.data.ADS_DATA.LOCATION_X.max = mapOverlay.offsetWidth - mapPinMain.offsetWidth / 2;
  }

  function onMapPinMainMousedown(evt) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      let shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      updateLocationX();

      mapPinMain.style.top = `${window.utils.checkInterval(`LOCATION_Y`, mapPinMain.offsetTop - shift.y)}px`;
      mapPinMain.style.left = `${window.utils.checkInterval(`LOCATION_X`, mapPinMain.offsetLeft - shift.x)}px`;
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);

      // Установить активный режим
      if (map.matches(`.map--faded`)) {
        window.data.loadAds();
      }

      window.form.setAdFormAddress(window.map.getCoordinats(false));
      window.map.updateMap();
    }

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  }

  // Установить неактивный режим
  window.map.setMapInactiveMode();
  window.form.setFormInactiveMode();

  mapPinMain.addEventListener(`mousedown`, onMapPinMainMousedown);

})();
