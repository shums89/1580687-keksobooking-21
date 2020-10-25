'use strict';

(function () {

  function getDistance(element) {
    const pinMainCoords = window.map.getCoordinats(false).split(`,`);

    return Math.sqrt(Math.abs(Math.pow(pinMainCoords[0] - element.location.x, 2) + Math.pow(pinMainCoords[1] - element.location.y, 2)));
  }

  function sortByDistance(data) {
    return data.sort(function (left, right) {
      return getDistance(left) - getDistance(right);
    });
  }

  function addUniqueElement(element, arr) {
    const newSet = new Set(arr);
    newSet.add(element);

    return [...newSet];
  }

  function checkSimpleChoice(nameFilter, value) {
    window.data.loadedAds.forEach((element) => {
      if (String(element.offer[nameFilter]) === value || value === `any`) {
        element.matches = element.matches.filter((item) => item !== nameFilter);
      } else {
        element.matches = addUniqueElement(nameFilter, element.matches);
      }
    });
  }

  function applyFilter(nameFilter, value) {
    switch (nameFilter) {
      case `housing-type`:
      case `housing-rooms`:
      case `housing-guests`:
        checkSimpleChoice(nameFilter.split(`-`)[1], value);
        break;
    }
  }

  function filtering(nameFilter, value) {
    window.data.filteredAds = [];

    if (window.data.loadedAds.length) {
      applyFilter(nameFilter, value);
    }

    window.data.loadedAds.forEach((element) => {
      if (!element.matches.length) {
        window.data.filteredAds.push(element);
      }
    });

    window.data.filteredAds = sortByDistance(window.data.filteredAds);

    window.pin.addPins(document.querySelector(`.map`));
  }

  window.filter = {
    filtering
  };

})();
