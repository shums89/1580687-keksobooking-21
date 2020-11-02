'use strict';

(function () {

  const DEBOUNCE_INTERVAL = 500;
  const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

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
    collection.forEach((element) => {
      element.remove();
    });
  }

  // Проверка интервала
  function checkInterval(parameter, value) {
    if (value < window.data.ADS_DATA[parameter].min) {
      value = window.data.ADS_DATA[parameter].min;
    } else if (value > window.data.ADS_DATA[parameter].max) {
      value = window.data.ADS_DATA[parameter].max;
    }

    return value;
  }

  function debounce(callback) {
    let lastTimeout = null;

    return function (...args) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        callback(...args);
      }, DEBOUNCE_INTERVAL);
    };
  }

  function setPhotoSrc(fileChooser, element) {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener(`load`, function () {
        element.src = reader.result;
      });
    }
  }

  window.utils = {
    getRandomInteger,
    getRandomElement,
    getCorrectOrderList,
    getEnding,
    setDisabled,
    removeElements,
    checkInterval,
    debounce,
    setPhotoSrc
  };

})();
