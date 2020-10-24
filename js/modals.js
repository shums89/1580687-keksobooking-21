'use strict';

(function () {

  function showSuccessMessage(message) {
    showDialogMessage(`success`, message);
  }

  function showErrorMessage(message, callback) {
    showDialogMessage(`error`, message, callback);
  }

  function showDialogMessage(nameElement, message, nameOperation) {
    const template = document.querySelector(`#${nameElement}`);
    const element = template.content.querySelector(`.${nameElement}`).cloneNode(true);
    const elementButton = element.querySelector(`.${nameElement}__button`);

    element.querySelector(`.${nameElement}__message`).textContent = message || `Неизвестная ошибка`;
    element.classList.add(`user-message-active`);

    document.body.prepend(element);

    function closeError() {
      window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

      elementButton.removeEventListener(`click`, onElementButtonClick);
      document.removeEventListener(`click`, onCloseError);
      document.removeEventListener(`keydown`, onErrorKeydown);
    }

    function onCloseError() {
      closeError();
    }

    function onErrorKeydown() {
      closeError();
    }

    function onElementButtonClick() {
      closeError();
      switch (nameOperation) {
        case `loadData`:
          window.map.updateMap();
          break;
        case `uploadData`:
          // ! Добавить отправку данных
          break;
      }
    }

    if (elementButton) {
      elementButton.addEventListener(`click`, onElementButtonClick);
    }

    document.addEventListener(`click`, onCloseError);
    document.addEventListener(`keydown`, onErrorKeydown);
  }

  window.modals = {
    showSuccessMessage,
    showErrorMessage
  };

})();
