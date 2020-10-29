'use strict';

(function () {

  function showSuccessMessage(message, callback) {
    showDialogMessage(`success`, message, callback);
  }

  function showErrorMessage(message, nameOperation) {
    showDialogMessage(`error`, message, nameOperation);
  }

  function showDialogMessage(nameElement, message, nameOperation) {
    let isRunCallback = false;

    const template = document.querySelector(`#${nameElement}`);
    const element = template.content.querySelector(`.${nameElement}`).cloneNode(true);
    const elementButton = element.querySelector(`.${nameElement}__button`);

    element.querySelector(`.${nameElement}__message`).textContent = message || `Неизвестная ошибка`;
    element.classList.add(`user-message-active`);

    document.body.prepend(element);

    function closeDialogActive() {
      if (isRunCallback) {
        nameOperation();
      }

      window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

      if (elementButton) {
        elementButton.removeEventListener(`click`, onElementButtonClick);
      }
      document.removeEventListener(`click`, onDocumentClick);
      document.removeEventListener(`keydown`, onDocumentKeydown);
    }

    function onDocumentClick() {
      if (nameElement === `success`) {
        isRunCallback = true;
      }
      closeDialogActive();
    }

    function onDocumentKeydown(evt) {
      if (evt.key === `Escape`) {
        closeDialogActive();
      }
    }

    function onElementButtonClick() {
      isRunCallback = true;
      closeDialogActive();
    }

    if (elementButton) {
      elementButton.addEventListener(`click`, onElementButtonClick);
    }
    document.addEventListener(`click`, onDocumentClick);
    document.addEventListener(`keydown`, onDocumentKeydown);
  }

  window.modals = {
    showSuccessMessage,
    showErrorMessage,
    showDialogMessage
  };

})();
