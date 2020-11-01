'use strict';

(function () {

  const mapFilters = document.querySelector(`.map`).querySelector(`.map__filters`);
  const filterType = mapFilters.querySelector(`#housing-type`);
  const filterPrice = mapFilters.querySelector(`#housing-price`);
  const filterRooms = mapFilters.querySelector(`#housing-rooms`);
  const filterGuests = mapFilters.querySelector(`#housing-guests`);
  const filterFeatures = mapFilters.querySelector(`#housing-features`).querySelectorAll(`input[name="features"]`);

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

    return (filterType.value === `any` || value === filterType.value);
  }

  function filterByPrice(element) {
    const value = element.offer.price;

    return (filterPrice.value === `any` || value >= HOUSING_PRICE[filterPrice.value].MIN && value <= HOUSING_PRICE[filterPrice.value].MAX);
  }

  function filterByRooms(element) {
    const value = String(element.offer.rooms);

    return (filterRooms.value === `any` || value === filterRooms.value);
  }

  function filterByGuests(element) {
    const value = String(element.offer.guests);

    return (filterGuests.value === `any` || value === filterGuests.value);
  }

  function filterByFeatures(element) {
    return [...filterFeatures].some((filter) => filter.checked && !element.offer.features.includes(filter.value));
  }

  function filtering() {
    let filteredAds = [];

    window.data.loadedAds.forEach((element, i) => {
      if (filterByType(element) && filterByPrice(element) && filterByRooms(element) && filterByGuests(element) && !filterByFeatures(element)) {
        filteredAds = addUniqueElement(i, filteredAds);
      }
    });

    return sortByDistance(filteredAds);
  }

  window.filter = {
    filtering
  };

})();
