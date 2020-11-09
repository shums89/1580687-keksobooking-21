'use strict';

const map = document.querySelector(`.map`);
const mapPins = map.querySelector(`.map__pins`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
const popupFeatureTemplate = cardTemplate.querySelector(`.popup__features`).querySelector(`.popup__feature`);
const popupPhotoTemplate = cardTemplate.querySelector(`.popup__photos`).querySelector(`.popup__photo`);

// Вывод количества комнат и гостей
function getTextRoomsAndGuests(ad) {
  let str = `${ad.offer.rooms} ${window.utils.getWordEnding(ad.offer.rooms, [`комната`, `комнаты`, `комнат`])} `;

  str += (ad.offer.guests) ?
    `для ${ad.offer.guests} ${window.utils.getWordEnding(ad.offer.guests, [`гостя`, `гостей`, `гостей`])}` :
    `без гостей`;

  return str;
}

// Создание Фрагмента доступных удобств
function createPopupFeaturesFragment(features) {
  const popupFeatureFragment = document.createDocumentFragment();

  features.forEach((feature) => {
    const popupFeatureElement = popupFeatureTemplate.cloneNode(true);
    popupFeatureElement.className = `popup__feature popup__feature--${feature}`;
    popupFeatureFragment.appendChild(popupFeatureElement);
  });

  return popupFeatureFragment;
}

// Создание Фрагмента фотографий
function createPopupPhotosFragment(photos) {
  const popupPhotoFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const popupPhotoElement = popupPhotoTemplate.cloneNode(true);
    popupPhotoElement.src = photo;
    popupPhotoFragment.appendChild(popupPhotoElement);
  });

  return popupPhotoFragment;
}

// Создание Фрагмента карточки объявления
function createCardElement(ad) {
  const cardElement = cardTemplate.cloneNode(true);

  const popupDescription = cardElement.querySelector(`.popup__description`);
  const popupFeatures = cardElement.querySelector(`.popup__features`);
  const popupPhotos = cardElement.querySelector(`.popup__photos`);

  cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
  cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = window.data.TYPE_HOUSING[ad.offer.type].translate;
  cardElement.querySelector(`.popup__text--capacity`).textContent = getTextRoomsAndGuests(ad);
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  // Необязательное поле, делаем проверку на наличие
  if (ad.offer.description) {
    popupDescription.textContent = ad.offer.description;
  } else {
    popupDescription.classList.add(`hidden`);
  }

  // Получение доступных удобств в карточке объявления, или скрытие данного блока
  if (ad.offer.features) {
    const popupFeatureFragment = createPopupFeaturesFragment(ad.offer.features);

    popupFeatures.innerHTML = ``;
    popupFeatures.appendChild(popupFeatureFragment);
  } else {
    popupFeatures.classList.add(`hidden`);
  }

  // Получение всех фотографий из списка photos или скрытие данного блока
  if (ad.offer.photos) {
    const popupPhotoFragment = createPopupPhotosFragment(ad.offer.photos);

    popupPhotos.innerHTML = ``;
    popupPhotos.appendChild(popupPhotoFragment);
  } else {
    popupPhotos.classList.add(`hidden`);
  }

  return cardElement;
}

function onCardPopupCloseClick(evt) {
  evt.target.removeEventListener(`click`, onCardPopupCloseClick);

  window.card.removeCard();
}

// Добавить карточку объявления
function renderCard(id) {
  const cardElement = createCardElement(window.data.loadedAds[id]);

  mapPins.after(cardElement);

  const card = map.querySelector(`.popup__close`);
  card.addEventListener(`click`, onCardPopupCloseClick);
}

// Удалить карточку объявления
function removeCard() {
  const card = map.querySelector(`article[class="map__card popup"]`);

  if (card) {
    card.remove();
  }
  window.pin.removeActivePin();
}

window.card = {
  renderCard,
  removeCard
};
