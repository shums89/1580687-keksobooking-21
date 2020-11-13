'use strict';

const TIMEOUT_IN_MS = 10000;
const responseType = `json`;

const URLS = {
  get: `https://21.javascript.pages.academy/keksobooking/data11`,
  post: `https://21.javascript.pages.academy/keksobooking11`
};

const SUCCESSFUL_RESPONSES = {
  min: 200,
  max: 299
};

const SERVER_CODE = {
  400: `Неверный запрос`,
  401: `Пользователь не авторизован`,
  404: `Ничего не найдено`,
  500: `Ошибка сервера`
};

function getData(onSuccess, onError) {
  const xhr = new XMLHttpRequest();

  xhr.responseType = responseType;
  xhr.timeout = TIMEOUT_IN_MS;

  xhr.addEventListener(`load`, () => {
    if (xhr.status >= SUCCESSFUL_RESPONSES.min && xhr.status <= SUCCESSFUL_RESPONSES.max) {
      onSuccess(xhr.response);
    } else {
      onError(SERVER_CODE[xhr.status] || `Статус ответа: ${xhr.status} ${xhr.statusText}`);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  return xhr;
}

function load(onSuccess, onError) {
  const xhr = getData(onSuccess, onError);

  xhr.open(`GET`, URLS.get);
  xhr.send();
}

function upload(data, onSuccess, onError) {
  const xhr = getData(onSuccess, onError);

  xhr.open(`POST`, URLS.post);
  xhr.send(data);
}

window.network = {
  load,
  upload
};
