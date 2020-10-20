'use strict';

(function () {

  // Генерация случайного числа
  function getRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  // Получение случайного элемента массива
  function getRandomElement(arr) {
    return arr[getRandomInteger(0, arr.length - 1)];
  }

  // Получение нового массива
  function getCorrectOrderList(arr) {
    return arr.filter(() => getRandomInteger(0, 1));
  }

  // Склонение существительных
  function getEnding(number, words) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  }

  // Настройка доступа
  function setDisabled(collection, disabled = true) {
    collection.forEach((element) => {
      if (disabled) {
        element.setAttribute(`disabled`, ``);
      } else {
        element.removeAttribute(`disabled`);
      }
    });
  }

  // Получить координаты элемента
  function getCoordinats(element, location, isCenter = true) {
    const locationData = location.getBoundingClientRect();
    const elementData = element.getBoundingClientRect();

    const x = Math.round(elementData.left - locationData.left + elementData.width / 2);
    const y = Math.round(elementData.top - locationData.top + (!isCenter && element.scrollHeight || elementData.height / 2));

    return `${x}, ${y}`;
  }

  // Удалить элементы
  function removeElements(collection) {
    if (collection.length) {
      collection.forEach((element) => {
        element.remove();
      });
    }
  }


  window.utils = {
    getRandomInteger,
    getRandomElement,
    getCorrectOrderList,
    getEnding,
    setDisabled,
    getCoordinats,
    removeElements
  };

})();
