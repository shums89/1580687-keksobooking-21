'use strict';

(function () {

  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

  const popupFeatureTemplate = cardTemplate.querySelector(`.popup__features`).querySelector(`.popup__feature`);
  const popupPhotoTemplate = cardTemplate.querySelector(`.popup__photos`).querySelector(`.popup__photo`);

  // Вывод количества комнат и гостей
  function getTextRoomsAndGuests(ad) {
    let str = `${ad.offer.rooms} ${window.utils.getEnding(ad.offer.rooms, [`комната`, `комнаты`, `комнат`])} `;
    str += (ad.offer.guests) ? `для ${ad.offer.guests} ${window.utils.getEnding(ad.offer.guests, [`гостя`, `гостей`, `гостей`])}` : `без гостей`;
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

    const popupFeatures = cardElement.querySelector(`.popup__features`);
    const popupPhotos = cardElement.querySelector(`.popup__photos`);

    cardElement.querySelector(`.popup__close`).dataset.name = `map_card`;

    cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;
    cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
    cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
    cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
    cardElement.querySelector(`.popup__type`).textContent = window.data.TYPE_HOUSING[ad.offer.type].translate;
    cardElement.querySelector(`.popup__text--capacity`).textContent = getTextRoomsAndGuests(ad);
    cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

    // Необязательное поле, делаем проверку на наличие
    if (ad.offer.description) {
      cardElement.querySelector(`.popup__description`).textContent = ad.offer.description;
    } else {
      cardElement.classList.add(`hidden`);
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

  // Добавить карточку объявления
  function addCard(index, location) {
    const cardElement = createCardElement(window.data.filteredAds[index]);

    location.after(cardElement);
  }

  // Удалить карточку объявления
  function removeCard(location) {
    const collectionCard = location.querySelectorAll(`article[class="map__card popup"]`);

    window.utils.removeElements(collectionCard);
  }

  window.card = {
    addCard,
    removeCard
  };

})();
