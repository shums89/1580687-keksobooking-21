'use strict';

const TIMEOUT_IN_MS = 10000;
const responseType = `json`;

const URLS = {
  get: `https://21.javascript.pages.academy/keksobooking/data`,
  post: `https://21.javascript.pages.academy/keksobooking`
};

const SERVER_CODE = {
  400: `Неверный запрос`,
  401: `Пользователь не авторизован`,
  404: `Ничего не найдено`,
  500: `Ошибка сервера`
};

function load(onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.timeout = TIMEOUT_IN_MS;

  xhr.addEventListener(`load`, () => {
    onSuccess(xhr.response);
  });

  xhr.addEventListener(`error`, () => {
    onError(SERVER_CODE[xhr.status] || `Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.open(`GET`, URLS.get);
  xhr.send();
}

function upload(data, onSuccess, onError) {
  const xhr = new XMLHttpRequest();

  xhr.responseType = `json`;
  xhr.timeout = TIMEOUT_IN_MS;

  xhr.addEventListener(`load`, function () {
    onSuccess(`Ваша заявка успешно отправлена`);
  });

  xhr.addEventListener(`error`, function () {
    onError(SERVER_CODE[xhr.status] || `Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.open(`POST`, URLS.post);
  xhr.send(data);
}

window.network = {
  load,
  upload
};
