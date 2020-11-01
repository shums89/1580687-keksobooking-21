'use strict';

(function () {

  const TIMEOUT_IN_MS = 10000;

  const URLS = {
    get: `https://21.javascript.pages.academy/keksobooking/data`,
    post: `https://21.javascript.pages.academy/keksobooking`
  };

  const SERVER_CODE = {
    200: {
      type: `success`,
      message: `Запрос успешно выполнен`
    },
    400: {
      type: `error`,
      message: `Неверный запрос`
    },
    401: {
      type: `error`,
      message: `Пользователь не авторизован`
    },
    404: {
      type: `error`,
      message: `Ничего не найдено`
    },
    500: {
      type: `error`,
      message: `Ошибка сервера`
    }
  };

  function load(onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener(`load`, function () {
      switch (SERVER_CODE[xhr.status].type) {
        case `success`:
          onSuccess(xhr.response);
          break;
        case `error`:
          onError(SERVER_CODE[xhr.status].message);
          break;
        default:
          onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
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
      switch (SERVER_CODE[xhr.status].type) {
        case `success`:
          onSuccess(`Ваша заявка успешно отправлена`);
          break;
        case `error`:
          onError(SERVER_CODE[xhr.status].message);
          break;
        default:
          onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
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
})();
