'use strict';

(function () {

  const HOUSING_PRICE = {
    'middle': {
      MIN: 10000,
      MAX: 50000
    },
    'low': {
      MIN: 0,
      MAX: 10000
    },
    'high': {
      MIN: 50000,
      MAX: Number.POSITIVE_INFINITY
    }
  };

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

  function checkCondition(element, nameFilter, value, checked) {
    let condition = false;

    switch (nameFilter) {
      case `type`:
      case `rooms`:
      case `guests`:
        condition = (value === `any` || String(element.offer[nameFilter]) === value);
        break;
      case `price`:
        condition = (value === `any` || element.offer[nameFilter] >= HOUSING_PRICE[value].MIN && element.offer[nameFilter] <= HOUSING_PRICE[value].MAX);
        break;
      case `features`:
        condition = (!checked || element.offer[nameFilter].includes(value) && checked);
    }

    return condition;
  }

  function filtering(nameFilter, value, checked = false) {
    window.data.filteredAds = [];
    let parametrUpdating;

    window.data.loadedAds.forEach((element) => {
      parametrUpdating = (nameFilter === `features`) ? value : nameFilter;

      if (nameFilter) {
        if (checkCondition(element, nameFilter, value, checked)) {
          element.restrictions = element.restrictions.filter((item) => item !== parametrUpdating);
        } else {
          element.restrictions = addUniqueElement(parametrUpdating, element.restrictions);
        }
      }

      if (!element.restrictions.length) {
        window.data.filteredAds.push(element);
      }
    });

    window.data.filteredAds = sortByDistance(window.data.filteredAds);

    window.pin.addPins();
  }

  window.filter = {
    filtering
  };

})();
