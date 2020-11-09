'use strict';

function showDialogMessage(selector, message = ``, callback) {
  const template = document.querySelector(`#${selector}`);

  function closeActiveDialogs() {
    window.utils.removeElements(document.body.querySelectorAll(`.user-message-active`));

    document.removeEventListener(`click`, onDocumentClick);
    document.removeEventListener(`keydown`, onDocumentKeydown);
  }

  function onDocumentClick(evt) {
    closeActiveDialogs();

    if (callback && evt.target.matches(`button`)) {
      callback();
    }
  }

  function onDocumentKeydown(evt) {
    if (evt.key === `Escape`) {
      closeActiveDialogs();
    }
  }

  const element = template.content.querySelector(`.${selector}`).cloneNode(true);

  element.querySelector(`.${selector}__message`).textContent = message;
  element.classList.add(`user-message-active`);

  document.body.prepend(element);

  document.addEventListener(`click`, onDocumentClick);
  document.addEventListener(`keydown`, onDocumentKeydown);
}

window.modals = {
  showDialogMessage
};
