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

  function load(method, data, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(method, window.data.ADS_DATA.URLS[method]);
    xhr.send(data);

    xhr.addEventListener(`load`, function () {
      switch (SERVER_CODE[xhr.status].type) {
        case `success`:
          switch (method) {
            case `GET`:
              onSuccess(xhr.response);
              break;
            case `POST`:
              onSuccess(`Ваша заявка успешно отправлена`);
              break;
            default:
              onSuccess(SERVER_CODE[xhr.status].message);
          }
          break;
        case `error`:
          onError(SERVER_CODE[xhr.status].message);
          break;
        default:
          onError(`Статус ответа: ${xhr.status} ${xhr.statusText}`, `loadData`);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`, `loadData`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout} мс`, `loadData`);
    });
  }

  window.load = {
    load
  };
})();
