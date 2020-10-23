'use strict';

(function () {

  const adForm = document.querySelector(`.ad-form`);
  const adFormSubmit = adForm.querySelector(`.ad-form__submit`);
  const adFormReset = adForm.querySelector(`.ad-form__reset`);
  const adFormFieldsets = adForm.querySelectorAll(`fieldset`);
  const adFormType = adForm.querySelector(`#type`);
  const adFormPrice = adForm.querySelector(`#price`);
  const adFormTimein = adForm.querySelector(`#timein`);
  const adFormTimeout = adForm.querySelector(`#timeout`);
  const adFormRoomNumber = adForm.querySelector(`#room_number`);
  const adFormCapacity = adForm.querySelector(`#capacity`);

  function checkType() {
    const typeValue = adFormType.value;
    const newValue = window.data.TYPE_HOUSING[typeValue].minPrice;

    adFormPrice.min = newValue;
    adFormPrice.placeholder = newValue;
  }

  function checkTime(element) {
    let textValidityTimein = ``;
    let textValidityTimeout = ``;

    if (adFormTimeout.value !== adFormTimein.value) {
      switch (element) {
        case `timein`:
          textValidityTimeout = `Время выезда должно быть до ${adFormTimein.value}`;
          break;
        case `timeout`:
          textValidityTimein = `Время заезда должно быть после ${adFormTimeout.value}`;
          break;
      }
    }

    adFormTimein.setCustomValidity(textValidityTimein);
    adFormTimeout.setCustomValidity(textValidityTimeout);

    adFormTimein.reportValidity();
    adFormTimeout.reportValidity();
  }

  function checkRoomNumber() {
    const roomNumberValue = adFormRoomNumber.value;
    const capacityValue = adFormCapacity.value;

    const textValidityCapacity = (window.data.CAPACITY_VALIDITY[roomNumberValue].values.includes(capacityValue)) ? `` : window.data.CAPACITY_VALIDITY[roomNumberValue].textError;

    adFormCapacity.setCustomValidity(textValidityCapacity);
    adFormCapacity.reportValidity();
  }

  function onAdFormSubmitClick() {
    // evt.preventDefault();
    // setInactiveMode
  }

  function onAdFormResetClick(evt) {
    if (evt.button === 0) {
      window.map.setMapInactiveMode();
      setFormInactiveMode();
    }
  }

  function onAdFormChange(evt) {
    const id = evt.target.id;

    switch (id) {
      case `type`:
        checkType();
        break;

      case `room_number`:
      case `capacity`:
        checkRoomNumber();
        break;

      case `timein`:
      case `timeout`:
        checkTime(id);
        break;
    }
  }

  function setAdFormAddress(coordinats) {
    adForm.address.value = coordinats;
  }

  function setFormInactiveMode() {
    adForm.classList.add(`ad-form--disabled`);

    // Заблокировать ввод объявления
    window.utils.setDisabled(adFormFieldsets);

    // Добавить сброс полей ввода

    removeAdFormEventListeners();
  }

  function setFormActiveMode() {
    adForm.classList.remove(`ad-form--disabled`);
    window.utils.setDisabled(adFormFieldsets, false);
    addAdFormEventListeners();
  }

  function addAdFormEventListeners() {
    adFormSubmit.addEventListener(`click`, onAdFormSubmitClick);
    adFormReset.addEventListener(`click`, onAdFormResetClick);
    adForm.addEventListener(`change`, onAdFormChange);
  }

  function removeAdFormEventListeners() {
    adFormSubmit.removeEventListener(`click`, onAdFormSubmitClick);
    adFormReset.removeEventListener(`click`, onAdFormResetClick);
    adForm.removeEventListener(`change`, onAdFormChange);
  }

  window.form = {
    setAdFormAddress,
    addAdFormEventListeners,
    removeAdFormEventListeners,
    setFormInactiveMode,
    setFormActiveMode
  };

})();
