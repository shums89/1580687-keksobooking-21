'use strict';

function showDialogMessage(dialog, message, callback) {
  const template = document.querySelector(`#${dialog}`);

  function closeDialogActive() {
    window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

    document.removeEventListener(`click`, onDocumentClick);
    document.removeEventListener(`keydown`, onDocumentKeydown);
  }

  function onDocumentClick(evt) {
    closeDialogActive();

    if (callback && evt.target.matches(`button`)) {
      callback();
    }
  }

  function onDocumentKeydown(evt) {
    if (evt.key === `Escape`) {
      closeDialogActive();
    }
  }

  const element = template.content.querySelector(`.${dialog}`).cloneNode(true);

  element.querySelector(`.${dialog}__message`).textContent = message || dialog;
  element.classList.add(`user-message-active`);

  document.body.prepend(element);

  document.addEventListener(`click`, onDocumentClick);
  document.addEventListener(`keydown`, onDocumentKeydown);
}

window.modals = {
  showDialogMessage
};
