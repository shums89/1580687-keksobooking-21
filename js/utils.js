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

  // Удалить элементы
  function removeElements(collection) {
    if (collection.length) {
      collection.forEach((element) => {
        element.remove();
      });
    }
  }

  // Проверка интервала
  function checkInterval(parameter, value) {
    if (value < window.data.ADS_DATA[parameter].MIN) {
      value = window.data.ADS_DATA[parameter].MIN;
    } else if (value > window.data.ADS_DATA[parameter].MAX) {
      value = window.data.ADS_DATA[parameter].MAX;
    }

    return value;
  }

  window.utils = {
    getRandomInteger,
    getRandomElement,
    getCorrectOrderList,
    getEnding,
    setDisabled,
    removeElements,
    checkInterval
  };

})();
