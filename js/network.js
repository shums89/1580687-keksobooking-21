'use strict';

(function () {

  const TIMEOUT_IN_MS = 10000;

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
          onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`, `GET`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`, `GET`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`, `GET`);
    });

    xhr.open(`GET`, window.data.ADS_DATA.URLS[`GET`]);
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
          onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`, `POST`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`, `POST`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`, `POST`);
    });

    xhr.open(`POST`, window.data.ADS_DATA.URLS[`POST`]);
    xhr.send(data);
  }

  window.network = {
    load,
    upload
  };
})();
