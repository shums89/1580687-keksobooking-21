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

  function load(onSuccess, error) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener(`load`, function () {
      switch (SERVER_CODE[xhr.status].type) {
        case `success`:
          onSuccess(xhr.response);
          break;
        case `error`:
          error.onError(`error`, SERVER_CODE[xhr.status].message, error.callback);
          break;
        default:
          error.onError(`error`, `Статус ответа: ${xhr.status} ${xhr.statusText}`, error.callback);
      }
    });

    xhr.addEventListener(`error`, function () {
      error.onError(`error`, `Произошла ошибка соединения`, error.callback);
    });

    xhr.addEventListener(`timeout`, function () {
      error.onError(`error`, `Запрос не успел выполниться за ${xhr.timeout} мс`, error.callback);
    });

    xhr.open(`GET`, URLS.get);
    xhr.send();
  }

  function upload(data, success, error) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.addEventListener(`load`, function () {
      switch (SERVER_CODE[xhr.status].type) {
        case `success`:
          success.onSuccess(`success`, `Ваша заявка успешно отправлена`, success.callback);
          break;
        case `error`:
          error.onError(`error`, SERVER_CODE[xhr.status].message, error.callback);
          break;
        default:
          error.onError(`error`, `Статус ответа: ${xhr.status} ${xhr.statusText}`, error.callback);
      }
    });

    xhr.addEventListener(`error`, function () {
      error.onError(`error`, `Произошла ошибка соединения`, error.callback);
    });

    xhr.addEventListener(`timeout`, function () {
      error.onError(`error`, `Запрос не успел выполниться за ${xhr.timeout} мс`, error.callback);
    });

    xhr.open(`POST`, URLS.post);
    xhr.send(data);
  }

  window.network = {
    load,
    upload
  };
})();
