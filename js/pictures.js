'use strict';

var PICTURE_COUNT = 25;
var COMMENT_COUNT = 2;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var AVATAR_COUNT = 6;

var PICTURE = '.picture';
var PICTURE_TEMPLATE_ID = '#picture';
var BIG_PICTURE = '.big-picture';
var SOCIAL = '.social';

var descriptions = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var pictures = [];
var pictureList = document.querySelector(PICTURE + 's');
var bigPicture = document.querySelector(BIG_PICTURE);
var commentList = bigPicture.querySelector(SOCIAL + '__comments');
var commentElementCollection = commentList.children;
var commentElement = commentElementCollection[0].cloneNode(true);

var generateRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createPictureElement = function (picture) {
  var pictureTemplate = document.querySelector(PICTURE_TEMPLATE_ID)
    .content
    .querySelector(PICTURE + '__link');
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector(PICTURE + '__img')['src'] = picture.url;
  pictureElement.querySelector(PICTURE + '__stat--likes').textContent = picture.likes;
  pictureElement.querySelector(PICTURE + '__stat--comments').textContent = picture.comments.length;
  return pictureElement;
};

var fillPictureList = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < PICTURE_COUNT; i++) {
    var pictureObj = {};
    var strings = [];
    for (var cnt = 0; cnt < COMMENT_COUNT; cnt++) {
      strings[cnt] = comments[generateRandom(0, comments.length - 1)];
    }
    pictureObj.url = 'photos/' + (i + 1) + '.jpg';
    pictureObj.likes = generateRandom(LIKES_MIN, LIKES_MAX);
    pictureObj.comments = strings;
    pictureObj.description = descriptions[generateRandom(0, descriptions.length - 1)];
    pictures[i] = pictureObj;
    fragment.appendChild(createPictureElement(pictures[i]));
  }
  return fragment;
};

pictureList.appendChild(fillPictureList());

var activePicture = pictures[0];
var commentCount = activePicture.comments.length;

bigPicture.classList.remove('hidden');
bigPicture.querySelector(BIG_PICTURE + '__img').children[0]['src'] = activePicture.url;
bigPicture.querySelector('.likes-count').innerText = activePicture.likes;
bigPicture.querySelector('.comments-count').innerText = activePicture.comments.length;
bigPicture.querySelector(SOCIAL + '__caption').innerText = activePicture.description;

// если количество элементов блока .social__comments больше,
// чем в массиве с комментариями, то удаляем лишние элементы
while (commentElementCollection.length > commentCount) {
  commentList
    .removeChild(commentElementCollection[commentElementCollection.length - 1]);
}

for (var i = 0; i < commentCount; i++) {
  var element = commentElement.cloneNode(true);
  var textNode = document.createTextNode(activePicture.comments[i]);
  element.classList.add('social__comment--text');
  element.querySelector(SOCIAL + '__text').remove();
  element.querySelector(SOCIAL + '__picture')['src'] =
    'img/avatar-' + generateRandom(1, AVATAR_COUNT) + '.svg';
  element.appendChild(textNode);

  if (i < commentElementCollection.length) {
    commentList.replaceChild(element, commentElementCollection[i]);
  } else {
    commentList.appendChild(element);
  }
}

bigPicture.querySelector(SOCIAL + '__comment-count').classList.add('visually-hidden');
bigPicture.querySelector(SOCIAL + '__loadmore').classList.add('visually-hidden');
