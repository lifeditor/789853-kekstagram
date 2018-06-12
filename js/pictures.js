'use strict';

var PICTURE_COUNT = 25;
var COMMENT_COUNT = 2;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var AVATAR_COUNT = 6;

var PICTURE = '.picture';
var PICTURE_TEMPLATE = '#picture';
var SOCIAL_TEMPLATE = '#social__comment';
var BIG_PICTURE = '.big-picture';
var CSS_PREFIX = '.social';

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

var generateRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateUniqueComment = function (arrays) {
  var arrayCount = arrays.length;
  var string;
  var commentCount = comments.length;
  var flag;
  do {
    flag = 0;
    string = comments[generateRandom(0, commentCount - 1)];
    for (var i = 0; i < arrayCount; i++) {
      if (arrays[i] === string) {
        flag = 1;
        break;
      }
    }
  } while (flag === 1);
  return string;
};

var createPictures = function () {
  var pictures = [];

  for (var i = 0; i < PICTURE_COUNT; i++) {
    var pictureObj = {};
    var strings = [];

    for (var cnt = 0; cnt < COMMENT_COUNT; cnt++) {
      strings[cnt] = generateUniqueComment(strings);
    }
    pictureObj.url = 'photos/' + (i + 1) + '.jpg';
    pictureObj.likes = generateRandom(LIKES_MIN, LIKES_MAX);
    pictureObj.comments = strings;
    pictureObj.description =
      descriptions[generateRandom(0, descriptions.length - 1)];
    pictures[i] = pictureObj;
  }
  return pictures;
};

var setupPictureElement = function (picture, element) {
  element.querySelector(PICTURE + '__img')['src'] = picture.url;
  element.querySelector(PICTURE + '__stat--likes')
    .textContent = picture.likes;
  element.querySelector(PICTURE + '__stat--comments')
    .textContent = picture.comments.length;
  return element;
};

var setupCommentElement = function (comment, element) {
  var textNode = document.createTextNode(comment);

  element.querySelector(CSS_PREFIX + '__picture')['src'] =
    'img/avatar-' + generateRandom(1, AVATAR_COUNT) + '.svg';
  element.appendChild(textNode);
  return element;
};

var createElementList = function (arrays, templateID) {
  var selector = (templateID === PICTURE_TEMPLATE) ?
    '.picture__link' : '.social__comment';
  var elementTemplate = document.querySelector(templateID)
    .content
    .querySelector(selector);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrays.length; i++) {
    var element = elementTemplate.cloneNode(true);

    fragment.appendChild(
        (templateID === PICTURE_TEMPLATE) ?
          setupPictureElement(arrays[i], element) :
          setupCommentElement(arrays[i], element)
    );
  }
  return fragment;
};

var changeHidden = function (bigPicture) {
  bigPicture
    .classList.remove('hidden');
  bigPicture.querySelector(CSS_PREFIX + '__comment-count')
    .classList.add('visually-hidden');
  bigPicture.querySelector(CSS_PREFIX + '__loadmore')
    .classList.add('visually-hidden');
};

var setupBigPicture = function (picture) {
  var bigPicture = document.querySelector(BIG_PICTURE);
  var commentList = bigPicture
    .querySelector(CSS_PREFIX + '__comments');

  bigPicture.querySelector(BIG_PICTURE + '__img')
    .children[0]['src'] = picture.url;
  bigPicture.querySelector('.likes-count')
    .textContent = picture.likes;
  bigPicture.querySelector('.comments-count')
    .textContent = picture.comments.length;
  bigPicture.querySelector(CSS_PREFIX + '__caption')
    .textContent = picture.description;

  while (commentList.firstChild) {
    commentList.removeChild(commentList.firstChild);
  }
  commentList
    .appendChild(createElementList(picture.comments, SOCIAL_TEMPLATE));
  changeHidden(bigPicture);
};

var pictures = createPictures();

document.querySelector('.pictures')
  .appendChild(createElementList(pictures, PICTURE_TEMPLATE));
setupBigPicture(pictures[0]);
