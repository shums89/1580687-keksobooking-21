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

  const adFormHeaderUploadInput = adForm.querySelector(`.ad-form-header__upload input[type=file]`);
  const adFormHeaderUploadPreview = adForm.querySelector(`.ad-form-header__upload .ad-form-header__preview img`);
  const adFormUploadInput = adForm.querySelector(`.ad-form__upload input[type=file]`);
  // const adFormUploadPreview = adForm.querySelector(`.ad-form__photo`);

  function checkType() {
    const typeValue = adFormType.value;
    const newValue = window.data.TYPE_HOUSING[typeValue].minPrice;

    adFormPrice.min = newValue;
    adFormPrice.placeholder = newValue;
  }

  function checkTime() {
    if (adFormTimeout.value !== adFormTimein.value) {
      adFormTimeout.setCustomValidity(`Время выезда должно быть до ${adFormTimein.value}`);
    }

    adFormTimeout.reportValidity();
  }

  function checkRoomNumber() {
    const roomNumberValue = adFormRoomNumber.value;
    const capacityValue = adFormCapacity.value;

    const textValidityCapacity = (window.data.CAPACITY_VALIDITY[roomNumberValue].values.includes(capacityValue)) ? `` : window.data.CAPACITY_VALIDITY[roomNumberValue].textError;

    adFormCapacity.setCustomValidity(textValidityCapacity);
    adFormCapacity.reportValidity();
  }

  function resetAdForm() {
    adFormPrice.min = 0;
    adFormPrice.placeholder = 0;
    window.data.loadedAds = [];

    adForm.reset();
    window.map.setMapInactiveMode();
    setFormInactiveMode();
  }

  function uploadAdForm() {
    const SUCCESS = {
      onSuccess: window.modals.showDialogMessage,
      callback: resetAdForm
    };
    const ERROR = {
      onError: window.modals.showDialogMessage,
      callback: uploadAdForm
    };

    window.network.upload(new FormData(adForm), SUCCESS, ERROR);
  }

  function onAdFormSubmitClick(evt) {
    checkType();
    checkTime();
    checkRoomNumber();

    if (adForm.checkValidity()) {
      evt.preventDefault();
      uploadAdForm();
    }
  }

  function onAdFormResetClick(evt) {
    if (evt.button === 0) {
      evt.preventDefault();
      resetAdForm();
    }
  }

  function onHeaderUploadChange() {
    window.utils.renderPhotoPreview(adFormHeaderUploadInput, adFormHeaderUploadPreview);
  }

  function onUploadChange() {
    // TODO: загрузка фотки жилья
  }

  function setAdFormAddress(coordinats) {
    adForm.address.value = coordinats;
  }

  function setFormInactiveMode() {
    adForm.classList.add(`ad-form--disabled`);
    window.utils.setDisabled(adFormFieldsets);

    adFormSubmit.removeEventListener(`click`, onAdFormSubmitClick);
    adFormReset.removeEventListener(`click`, onAdFormResetClick);
    adFormHeaderUploadInput.removeEventListener(`change`, onHeaderUploadChange);
    adFormUploadInput.removeEventListener(`change`, onUploadChange);
  }

  function setFormActiveMode() {
    adForm.classList.remove(`ad-form--disabled`);
    window.utils.setDisabled(adFormFieldsets, false);

    adFormSubmit.addEventListener(`click`, onAdFormSubmitClick);
    adFormReset.addEventListener(`click`, onAdFormResetClick);
    adFormHeaderUploadInput.addEventListener(`change`, onHeaderUploadChange);
    adFormUploadInput.addEventListener(`change`, onUploadChange);
  }

  window.form = {
    setAdFormAddress,
    setFormInactiveMode,
    setFormActiveMode,
    uploadAdForm
  };

})();
