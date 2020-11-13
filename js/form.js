'use strict';

const DEFAULT_PHOTO = `img/muffin-grey.svg`;

const CAPACITY_VALIDITY = {
  '1': {
    values: [`1`],
    textError: `1 комната — «для 1 гостя»`
  },
  '2': {
    values: [`1`, `2`],
    textError: `для 2 гостей» или «для 1 гостя»`
  },
  '3': {
    values: [`1`, `2`, `3`],
    textError: `«для 3 гостей», «для 2 гостей» или «для 1 гостя»`
  },
  '100': {
    values: [`0`],
    textError: `«не для гостей»`
  }
};

const adForm = document.querySelector(`.ad-form`);
const buttonSubmit = adForm.querySelector(`.ad-form__submit`);
const buttonReset = adForm.querySelector(`.ad-form__reset`);
const fieldsets = adForm.querySelectorAll(`fieldset`);
const type = adForm.querySelector(`#type`);
const price = adForm.querySelector(`#price`);
const timein = adForm.querySelector(`#timein`);
const timeout = adForm.querySelector(`#timeout`);
const roomNumber = adForm.querySelector(`#room_number`);
const capacity = adForm.querySelector(`#capacity`);
const avatarUploadInput = adForm.querySelector(`.ad-form-header__upload input[type=file]`);
const avatarUploadPreview = adForm.querySelector(`.ad-form-header__upload .ad-form-header__preview img`);
const housingUploadInput = adForm.querySelector(`.ad-form__upload input[type=file]`);
const housingUploadPreview = adForm.querySelector(`.ad-form__photo`);


function resetAdForm() {
  window.map.deactivateMap();
  deactivateAdForm();

  price.min = 0;
  price.placeholder = 0;
  avatarUploadPreview.src = DEFAULT_PHOTO;
  housingUploadPreview.innerHTML = ``;
  adForm.reset();
}

function onSuccessUpload() {
  resetAdForm();
  window.modals.showDialogMessage(`success`, `Ваша заявка успешно отправлена`);
}

function unloadAdForm(message) {
  window.modals.showDialogMessage(`error`, message, uploadAdForm);
}

function uploadAdForm() {
  window.network.upload(new FormData(adForm), onSuccessUpload, unloadAdForm);
}

function onButtonSubmitClick(evt) {
  onChangeRoomNumber();

  if (adForm.checkValidity()) {
    evt.preventDefault();
    uploadAdForm();
  }
}

function onButtonResetClick(evt) {
  if (evt.button === 0) {
    evt.preventDefault();
    resetAdForm();
  }
}

function renderAvatarUploadPreview(src) {
  avatarUploadPreview.src = src;
}

function onAvatarUploadChange() {
  window.utils.getPhotoSrc(avatarUploadInput, renderAvatarUploadPreview);
}

function renderHousingUploadPreview(src) {
  housingUploadPreview.innerHTML = `<img src="${src}" alt="Фотография жилья" style="width: 100%; height: 100%; object-fit: contain">`;
}

function onHousingUploadChange() {
  window.utils.getPhotoSrc(housingUploadInput, renderHousingUploadPreview);
}

function onChangeType() {
  const typeValue = type.value;
  const newValue = window.data.TYPE_HOUSING[typeValue].minPrice;

  price.min = newValue;
  price.placeholder = newValue;
}

function onChangeTimein() {
  timeout.value = timein.value;
}

function onChangeTimeout() {
  timein.value = timeout.value;
}

function onChangeRoomNumber() {
  const roomNumberValue = roomNumber.value;
  const capacityValue = capacity.value;

  const textValidityCapacity = (CAPACITY_VALIDITY[roomNumberValue].values.includes(capacityValue)) ? `` : CAPACITY_VALIDITY[roomNumberValue].textError;

  capacity.setCustomValidity(textValidityCapacity);
  capacity.reportValidity();
}

function setAdFormAddress(coordinats) {
  adForm.address.value = coordinats;
}

function deactivateAdForm() {
  adForm.classList.add(`ad-form--disabled`);
  window.utils.setDisabled(fieldsets);

  buttonSubmit.removeEventListener(`click`, onButtonSubmitClick);
  buttonReset.removeEventListener(`click`, onButtonResetClick);
  type.removeEventListener(`change`, onChangeType);
  timein.removeEventListener(`change`, onChangeTimein);
  timeout.removeEventListener(`change`, onChangeTimeout);
  roomNumber.removeEventListener(`change`, onChangeRoomNumber);
  avatarUploadInput.removeEventListener(`change`, onAvatarUploadChange);
  housingUploadInput.removeEventListener(`change`, onHousingUploadChange);
}

function activateAdForm() {
  adForm.classList.remove(`ad-form--disabled`);
  window.utils.setDisabled(fieldsets, false);

  buttonSubmit.addEventListener(`click`, onButtonSubmitClick);
  buttonReset.addEventListener(`click`, onButtonResetClick);
  type.addEventListener(`change`, onChangeType);
  timein.addEventListener(`change`, onChangeTimein);
  timeout.addEventListener(`change`, onChangeTimeout);
  roomNumber.addEventListener(`change`, onChangeRoomNumber);
  avatarUploadInput.addEventListener(`change`, onAvatarUploadChange);
  housingUploadInput.addEventListener(`change`, onHousingUploadChange);
}

window.form = {
  setAdFormAddress,
  deactivateAdForm,
  activateAdForm
};
