'use strict';

(function () {

  const adForm = document.querySelector(`.ad-form`);

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

    function closeDialogActive() {
      window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

      if (elementButton) {
        elementButton.removeEventListener(`click`, onElementButtonClick);
      }
      document.removeEventListener(`click`, onCloseError);
      document.removeEventListener(`keydown`, onErrorKeydown);
    }

    function onCloseError() {
      closeDialogActive();
    }

    function onErrorKeydown(evt) {
      if (evt.key === `Escape`) {
        closeDialogActive();
      }
    }

    function onElementButtonClick() {
      closeDialogActive();
      switch (nameOperation) {
        case `GET`:
          window.map.setMapActiveMode();
          break;
        case `POST`:
          window.network.upload(new FormData(adForm), window.form.showSuccessSend, showErrorMessage);
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
