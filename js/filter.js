'use strict';

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

// Расчет кратчашего расстояния до метки (гипотенузы)
function getDistance(data) {
  const pinMainCoords = window.map.getCoordinats(false).split(`,`);

  return Math.sqrt(Math.abs(Math.pow(pinMainCoords[0] - data.location.x, 2) + Math.pow(pinMainCoords[1] - data.location.y, 2))
  );
}

// Поиск ближайщих меток к главной метке
function sortByDistance(data) {
  return data.sort(function (a, b) {
    return getDistance(a) - getDistance(b);
  });
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

function getFilterData(data) {
  const result = data.filter((element) =>
    filterByType(element) &&
    filterByPrice(element) &&
    filterByRooms(element) &&
    filterByGuests(element) &&
    !filterByFeatures(element)
  );

  return sortByDistance(result);
}

window.filter = {
  getFilterData
};
