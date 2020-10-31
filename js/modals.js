'use strict';

(function () {

  function showDialogMessage(nameElement, message, nameOperation) {
    const template = document.querySelector(`#${nameElement}`);

    function closeDialogActive() {
      if (nameOperation) {
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
      closeDialogActive();
    }

    function onDocumentKeydown(evt) {
      if (evt.key === `Escape`) {
        closeDialogActive();
      }
    }

    function onElementButtonClick() {
      closeDialogActive();
    }

    const element = template.content.querySelector(`.${nameElement}`).cloneNode(true);
    const elementButton = element.querySelector(`.${nameElement}__button`);

    element.querySelector(`.${nameElement}__message`).textContent = message || nameElement;
    element.classList.add(`user-message-active`);

    document.body.prepend(element);

    if (elementButton) {
      elementButton.addEventListener(`click`, onElementButtonClick);
    }
    document.addEventListener(`click`, onDocumentClick);
    document.addEventListener(`keydown`, onDocumentKeydown);
  }

  window.modals = {
    showDialogMessage
  };

})();
