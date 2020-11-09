'use strict';

const DEBOUNCE_INTERVAL = 500;
const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

// Склонение существительных
function getWordEnding(number, words) {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function setDisabled(collection, disabled = true) {
  collection.forEach((element) => {
    if (disabled) {
      element.setAttribute(`disabled`, ``);
    } else {
      element.removeAttribute(`disabled`);
    }
  });
}

function removeElements(collection) {
  collection.forEach((element) => {
    element.remove();
  });
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

function getPhotoSrc(fileChooser, onSuccess) {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();

  if (FILE_TYPES.some((it) => fileName.endsWith(it))) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.addEventListener(`load`, () => onSuccess(reader.result));
  }
}

window.utils = {
  getWordEnding,
  setDisabled,
  removeElements,
  debounce,
  getPhotoSrc
};
