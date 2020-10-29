'use strict';

(function () {

  const mapFilters = document.querySelector(`.map`).querySelector(`.map__filters`);

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

  function getDistance(index) {
    const pinMainCoords = window.map.getCoordinats(false).split(`,`);

    return Math.sqrt(Math.abs(Math.pow(pinMainCoords[0] - window.data.loadedAds[index].location.x, 2) + Math.pow(pinMainCoords[1] - window.data.loadedAds[index].location.y, 2)));
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

  function filterByType(element) {
    const value = element.offer.type;
    const valueFilter = mapFilters.querySelector(`#housing-type`).value;

    return (valueFilter === `any` || value === valueFilter);
  }

  function filterByPrice(element) {
    const value = element.offer.price;
    const valueFilter = mapFilters.querySelector(`#housing-price`).value;

    return (valueFilter === `any` || value >= HOUSING_PRICE[valueFilter].MIN && value <= HOUSING_PRICE[valueFilter].MAX);
  }

  function filterByRooms(element) {
    const value = String(element.offer.rooms);
    const valueFilter = mapFilters.querySelector(`#housing-rooms`).value;

    return (valueFilter === `any` || value === valueFilter);
  }

  function filterByGuests(element) {
    const value = String(element.offer.guests);
    const valueFilter = mapFilters.querySelector(`#housing-guests`).value;

    return (valueFilter === `any` || value === valueFilter);
  }

  function filterByFeatures(element) {
    const filterFeatures = mapFilters.querySelector(`#housing-features`).querySelectorAll(`input[name="features"]`);

    for (let i = 0; i < filterFeatures.length; i++) {
      if (filterFeatures[i].checked && !element.offer.features.includes(filterFeatures[i].value)) {
        return false;
      }
    }

    return true;
  }

  function filtering() {
    window.data.filteredAds = [];
    let filteredAds = [];

    window.data.loadedAds.forEach((element, i) => {
      if (filterByType(element) && filterByPrice(element) && filterByRooms(element) && filterByGuests(element) && filterByFeatures(element)) {
        filteredAds = addUniqueElement(i, filteredAds);
      }
    });

    return sortByDistance(filteredAds);
  }

  window.filter = {
    filtering
  };

})();
