'use strict';

(function () {

  function showDialogMessage(nameElement, message, nameOperation) {
    const template = document.querySelector(`#${nameElement}`);

    function closeDialogActive() {
      window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

      document.removeEventListener(`click`, onDocumentClick);
      document.removeEventListener(`keydown`, onDocumentKeydown);
    }

    function onDocumentClick(evt) {
      closeDialogActive();

      if (nameOperation && evt.target.matches(`button`)) {
        nameOperation();
      }
    }

    function onDocumentKeydown(evt) {
      if (evt.key === `Escape` || evt.key === `Enter` || evt.key === `F5`) {
        closeDialogActive();
      } else {
        evt.preventDefault();
      }
    }

    const element = template.content.querySelector(`.${nameElement}`).cloneNode(true);

    element.querySelector(`.${nameElement}__message`).textContent = message || nameElement;
    element.classList.add(`user-message-active`);

    document.body.prepend(element);

    document.addEventListener(`click`, onDocumentClick);
    document.addEventListener(`keydown`, onDocumentKeydown);
  }

  window.modals = {
    showDialogMessage
  };

})();
