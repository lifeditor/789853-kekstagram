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

var ESC_KEYCODE = 27;

var RESIZE_MIN = 25;
var RESIZE_MAX = 100;
var RESIZE_STEP = 25;
var DEFAULT_EFFECT_LEVEL = 100;

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

var pictureContainer = document.querySelector('.pictures');
var bigPicture = document.querySelector(BIG_PICTURE);
var closeBigPicture = bigPicture.querySelector('.big-picture__cancel');
var commentList = bigPicture.querySelector(CSS_PREFIX + '__comments');
var uploadPopup = pictureContainer.querySelector('.img-upload__overlay');
var uploadFile = pictureContainer.querySelector('.img-upload__start');
var uploadInput = uploadFile.querySelector('.img-upload__input');
var closeUploadPopup = uploadPopup.querySelector('.img-upload__cancel');
var uploadPreview = uploadPopup.querySelector('.img-upload__preview');
var uploadComment = uploadPopup.querySelector('.text__description');
var uploadScale = uploadPopup.querySelector('.img-upload__scale');
var scaleLine = uploadScale.querySelector('.scale__line');
var scalePin = uploadScale.querySelector('.scale__pin');
var scaleLevel = uploadScale.querySelector('.scale__level');
var scaleInput = uploadScale.querySelector('.scale__value');
// var defaultEffectLevel = scaleInput.value;
var resizeMinus = uploadPopup.querySelector('.resize__control--minus');
var resizePlus = uploadPopup.querySelector('.resize__control--plus');
var resizeInput = uploadPopup.querySelector('.resize__control--value');
var resizeValue = RESIZE_MAX;

var generateRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateUniqueComment = function (arrays) {
  var arrayCount = arrays.length;
  var string;
  var commentMaxIndex = comments.length - 1;
  var flag;

  do {
    flag = 0;
    string = comments[generateRandom(0, commentMaxIndex)];
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
    pictureObj.id = i;
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
  var image = element.querySelector(PICTURE + '__img');
  image.src = picture.url;
  image.id = picture.id;
  element.querySelector(PICTURE + '__stat--likes')
    .textContent = picture.likes;
  element.querySelector(PICTURE + '__stat--comments')
    .textContent = picture.comments.length;
  return element;
};

var setupCommentElement = function (comment, element) {
  var textNode = document.createTextNode(comment);

  element.querySelector(CSS_PREFIX + '__picture').src =
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

var hideBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

var showBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureEscPress);
  // bigPicture.querySelector(CSS_PREFIX + '__comment-count')
  //  .classList.add('visually-hidden');
  // bigPicture.querySelector(CSS_PREFIX + '__loadmore')
  //  .classList.add('visually-hidden');
};

var setupBigPicture = function (picture) {
  bigPicture.querySelector(BIG_PICTURE + '__img')
    .children[0].src = picture.url;
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
  showBigPicture();
};

var setupEffectLevel = function (level) {
  scaleInput.setAttribute('value', level);
  scaleLevel.style = 'width: ' + level + '%;';
  scalePin.style = 'left: ' + level + '%;';
};

var setupPreviewSize = function (value) {
  resizeInput.setAttribute('value', value + '%');
  uploadPreview.style = 'transform: scale(' + (value / 100) + ');';
};

var showUploadPopup = function () {
  setupPreviewSize(RESIZE_MAX);
  setupEffectLevel(DEFAULT_EFFECT_LEVEL);
  uploadPreview.classList.remove(uploadPreview.classList[1]);
  uploadPopup.classList.remove('hidden');
  document.addEventListener('keydown', onUploadPopupEscPress);
};

var hideUploadPopup = function () {
  resizeValue = RESIZE_MAX;
  uploadInput.value = ''; // cброс значения поля для правильной обработки onUploadFileChange
  uploadPopup.classList.add('hidden');
  document.removeEventListener('keydown', onUploadPopupEscPress);
};

var onUploadPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && document.activeElement !== uploadComment) {
    hideUploadPopup();
  }
};

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideBigPicture();
  }
};

var onDocumentBodyClick = function (evt) {
  var target = evt.target;

  if (target.className === 'picture__img') {
    setupBigPicture(pictures[target.id]);
  }
};

var onUploadPopupClick = function (evt) {
  var target = evt.target;

  if (target.classList[0] === 'effects__preview') {
    setupEffectLevel(DEFAULT_EFFECT_LEVEL);
    if (target.classList[1] === 'effects__preview--none') {
      uploadScale.classList.add('hidden'); // для оригинального изображения скрываем ползунок
    } else {
      uploadScale.classList.remove('hidden');
    }
    uploadPreview.classList.remove(uploadPreview.classList[1]);
    uploadPreview.classList.add(target.classList[1]);
  }
};

var onCloseUploadPopupClick = function () {
  hideUploadPopup();
};

var onCloseBigPictureClick = function () {
  hideBigPicture();
};

var onResizePreviewClick = function (evt) {
  resizeValue += (evt.target === resizePlus) ? RESIZE_STEP : -RESIZE_STEP;
  if (resizeValue > RESIZE_MAX) {
    resizeValue = RESIZE_MAX;
  } else if (resizeValue < RESIZE_MIN) {
    resizeValue = RESIZE_MIN;
  }
  setupPreviewSize(resizeValue);
};

var onUploadFileChange = function () {
  showUploadPopup();
};

var onScaleLineMouseUp = function (evt) {
  setupEffectLevel(Math.floor(evt.offsetX / scaleLine.clientWidth * 100));
};

document.addEventListener('click', onDocumentBodyClick);
uploadPopup.addEventListener('click', onUploadPopupClick);
closeUploadPopup.addEventListener('click', onCloseUploadPopupClick);
closeBigPicture.addEventListener('click', onCloseBigPictureClick);
resizeMinus.addEventListener('click', onResizePreviewClick);
resizePlus.addEventListener('click', onResizePreviewClick);
uploadFile.addEventListener('change', onUploadFileChange);
scaleLine.addEventListener('mouseup', onScaleLineMouseUp);

var pictures = createPictures();

pictureContainer
  .appendChild(createElementList(pictures, PICTURE_TEMPLATE));
