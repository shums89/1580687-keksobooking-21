'use strict';

const LOCATION_X = `LOCATION_X`;
const LOCATION_Y = `LOCATION_Y`;

const map = document.querySelector(`.map`);
const mapPinMain = map.querySelector(`.map__pin--main`);

function updateLocationX() {
  const mapOverlay = document.querySelector(`.map__overlay`);

  window.data.ADS_DATA.LOCATION_X.min = 0 - mapPinMain.offsetWidth / 2;
  window.data.ADS_DATA.LOCATION_X.max = mapOverlay.offsetWidth - mapPinMain.offsetWidth / 2;
}

function onMapPinMainMousedown(evt) {
  if (evt.button !== 0) {
    return;
  }

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

    mapPinMain.style.top = `${window.data.checkInterval(LOCATION_Y, mapPinMain.offsetTop - shift.y)}px`;
    mapPinMain.style.left = `${window.data.checkInterval(LOCATION_X, mapPinMain.offsetLeft - shift.x)}px`;
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);

    if (map.matches(`.map--faded`)) {
      window.map.activateMap();
      window.form.activateAdForm();
    } else {
      window.map.updateMap();
    }
  }

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
}

window.map.deactivateMap();
window.form.deactivateAdForm();

mapPinMain.addEventListener(`mousedown`, onMapPinMainMousedown);
