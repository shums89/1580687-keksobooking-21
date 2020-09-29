'use strict';

const ADS_DATA = {
  NUMBER_OF_ADS: 8, // количество обьявлений
  TAG_SIZE: {WIDTH: 50, HEIGHT: 70}, // размеры метки
  PRICE: {MIN: 5000, MAX: 80000}, // стоимость от .. до ..
  TYPE: [`palace`, `flat`, `house`, `bungalow`], // тип помещения
  ROOMS: {MIN: 1, MAX: 4}, // количество комнат от .. до ..
  GUESTS: {MIN: 0, MAX: 5}, // количество гостей, которое можно разместить от .. до ..
  CHECKIN: [`12:00`, `13:00`, `14:00`], // время заезда
  CHECKOUT: [`12:00`, `13:00`, `14:00`], // время выезда
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`], // доп услуги
  PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`],
  LOCATION_X: {MIN: 0, MAX: 1200}, // координата x метки на карте от .. до ..
  LOCATION_Y: {MIN: 130, MAX: 630} // координата y метки на карте от 130 до 630
};

function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomElementArray(arr) {
  return arr[getRandomInteger(0, arr.length - 1)];
}

function getRandomNewArray(arr) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    let newElement = getRandomElementArray(arr);
    if (!newArr.includes(newElement)) {
      newArr.push(newElement);
    }
  }
  return newArr;
}

function getAds(adsData = ADS_DATA) {
  const ads = [];
  for (let i = 0; i < adsData.NUMBER_OF_ADS; i++) {
    const ad = {
      author: {
        avatar: `img/avatars/user0${i + 1}.png`,
      },
      offer: {
        title: `Заголовок ${i + 1}`,
        price: getRandomInteger(adsData.PRICE.MIN, adsData.PRICE.MAX),
        type: getRandomElementArray(adsData.TYPE),
        rooms: getRandomInteger(adsData.ROOMS.MIN, adsData.ROOMS.MAX),
        guests: getRandomInteger(adsData.GUESTS.MIN, adsData.GUESTS.MAX),
        checkin: getRandomElementArray(adsData.CHECKIN),
        checkout: getRandomElementArray(adsData.CHECKOUT),
        features: getRandomNewArray(adsData.FEATURES),
        description: `Описание ${i + 1}`,
        photos: getRandomNewArray(adsData.PHOTOS)
      },
      location: {
        x: getRandomInteger(adsData.LOCATION_X.MIN + adsData.TAG_SIZE.WIDTH / 2, adsData.LOCATION_X.MAX - adsData.TAG_SIZE.WIDTH / 2),
        y: getRandomInteger(adsData.LOCATION_Y.MIN + adsData.TAG_SIZE.HEIGHT, adsData.LOCATION_Y.MAX + adsData.TAG_SIZE.HEIGHT)
      }
    };
    ad.offer.address = `${ad.location.x}, ${ad.location.y}`;
    ads.push(ad);
  }
  return ads;
}

function renderAd(ad, adsTemplate, adsData = ADS_DATA) {
  const adElement = adsTemplate.cloneNode(true);
  adElement.style = `left: ${ad.location.x - adsData.TAG_SIZE.WIDTH / 2}px; top: ${ad.location.y - adsData.TAG_SIZE.HEIGHT}px;`;
  const adElementImg = adElement.querySelector(`img`);
  adElementImg.src = ad.author.avatar;
  adElementImg.alt = ad.offer.title;
  return adElement;
}

function getFragment() {
  const adsTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const ads = getAds();
  const fragment = document.createDocumentFragment();
  ads.forEach(function (value) {
    fragment.appendChild(renderAd(value, adsTemplate));
  });
  return fragment;
}

function main() {
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);

  const adsListElement = map.querySelector(`.map__pins`);
  const fragment = getFragment();
  adsListElement.appendChild(fragment);
}

main();
