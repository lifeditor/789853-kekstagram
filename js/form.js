'use strict';

(function () {

  var RESIZE_MIN = 25;
  var RESIZE_MAX = 100;
  var RESIZE_STEP = 25;
  var DEFAULT_EFFECT_LEVEL = 100;
  var DEFAULT_EFFECT = 'effects__preview--none';
  var HASHTAG_MAX_LENGTH = 20;
  var DESCRIPTION_MAX_LENGTH = 140;
  var DESCRIPTION_ERROR = 'Длина описания больше 140 символов';
  var DIVIDER_CHAR = ' ';
  var HASHTAG_CHAR = '#';

  var filterStyle = {
    'effects__preview--none': {filter: 'filter: none;'},
    'effects__preview--chrome': {filter: 'filter: grayscale(', div: 100, mult: 1, add: 0, eofl: ');'},
    'effects__preview--sepia': {filter: 'filter: sepia(', div: 100, mult: 1, add: 0, eofl: ');'},
    'effects__preview--marvin': {filter: 'filter: invert(', div: 1, mult: 1, add: 0, eofl: '%);'},
    'effects__preview--phobos': {filter: 'filter: blur(', div: 100, mult: 3, add: 0, eofl: 'px);'},
    'effects__preview--heat': {filter: 'filter: brightness(', div: 100, mult: 2, add: 1, eofl: ');'}
  };

  var popup = document.querySelector('.img-upload__overlay');
  var fileInput = document.querySelector('.img-upload__input');
  var buttonHide = popup.querySelector('.img-upload__cancel');
  var preview = popup.querySelector('.img-upload__preview');
  var commentInput = popup.querySelector('.text__description');
  var scale = popup.querySelector('.img-upload__scale');
  var scaleLine = scale.querySelector('.scale__line');
  var scalePinHandler = scale.querySelector('.scale__pin');
  var scaleLevel = scale.querySelector('.scale__level');
  var scaleInput = scale.querySelector('.scale__value');
  var resizeMinus = popup.querySelector('.resize__control--minus');
  var resizePlus = popup.querySelector('.resize__control--plus');
  var resizeInput = popup.querySelector('.resize__control--value');
  var hashtagInput = popup.querySelector('.text__hashtags');
  var buttonSubmit = popup.querySelector('.img-upload__submit');
  var popupInputs = [hashtagInput, commentInput];
  var resize = RESIZE_MAX;
  var cssStyle = {};

  var setStyle = function (element, style) {
    element.style = style.filter + style.transform;
  };

  var setEffectLevel = function (level) {
    var ifOriginal = preview.classList.contains(DEFAULT_EFFECT);
    var css = filterStyle[preview.classList[1]];

    scaleInput.setAttribute('value', level);
    scaleLevel.style = 'width: ' + level + '%;';
    scalePinHandler.style = 'left: ' + level + '%;';
    cssStyle.filter = (ifOriginal) ? css.filter :
      css.filter + (level / css.div * css.mult + css.add) + css.eofl;
    scale.classList // для оригинального изображения скрываем ползунок
    .toggle('hidden', ifOriginal);
    setStyle(preview, cssStyle);
  };

  var setPreviewSize = function (size) {
    resizeInput.setAttribute('value', size + '%');
    cssStyle.transform = 'transform: scale(' + (size / 100) + ');';
    setStyle(preview, cssStyle);
  };

  var hide = function () {
    resize = RESIZE_MAX;
    fileInput.value = ''; // cброс значения поля для правильной обработки change
    preview.classList.remove(preview.classList[1]);
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
    commentInput.style = '';
    hashtagInput.style = '';
  };

  window.form = {

    show: function () {
      preview.classList.add(DEFAULT_EFFECT);
      setPreviewSize(RESIZE_MAX);
      setEffectLevel(DEFAULT_EFFECT_LEVEL);
      popup.classList.remove('hidden');
      document.addEventListener('keydown', onEscPress);
    },

  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, hide, popupInputs);
  };

  var onResizeClick = function (evt) {
    resize += (evt.target === resizePlus) ? RESIZE_STEP : -RESIZE_STEP;
    if (resize > RESIZE_MAX) {
      resize = RESIZE_MAX;
    } else if (resize < RESIZE_MIN) {
      resize = RESIZE_MIN;
    }
    setPreviewSize(resize);
  };

  buttonHide.addEventListener('click', hide);
  resizeMinus.addEventListener('click', onResizeClick);
  resizePlus.addEventListener('click', onResizeClick);

  popup.addEventListener('click', function (evt) {
    var target = evt.target;

    if (target.classList.contains('effects__preview')) {
      preview.classList.remove(preview.classList[1]);
      preview.classList.add(target.classList[1]);
      setEffectLevel(DEFAULT_EFFECT_LEVEL);
    }
  });

  var checkHashtagErrors = function (hashtagString) {
    var errorString = '';
    var hashtags = [];
    var uniques = [];

    if (hashtagString.length > 0) {
      hashtags = hashtagString.toLowerCase().split(DIVIDER_CHAR);
      var hashtagCount = hashtags.length;

      for (var i = 0; i < hashtagCount; i++) {
        if (uniques.indexOf(hashtags[i]) === -1) {
          uniques.push(hashtags[i]);
        }
        if (hashtags[i].length === 0) {
          errorString += 'Найден лишний пробел\n\r';
        } else if (hashtags[i][0] !== HASHTAG_CHAR) {
          errorString += hashtags[i] + ' - Хеш-тег должен начинаться с #\n\r';
        } else if (hashtags[i].length > HASHTAG_MAX_LENGTH) {
          errorString += hashtags[i] + ' - Длина хэш-тега превышает ' +
           HASHTAG_MAX_LENGTH + ' символов\n\r';
        } else if (hashtags[i] === HASHTAG_CHAR) {
          errorString += hashtags[i] + ' - Хеш-тег введен неправильно\n\r';
        } else if (hashtags[i].indexOf(HASHTAG_CHAR, 1) > 0) {
          errorString += hashtags[i] + ' - Хэш-теги должны разделяться пробелом\n\r';
        }
      }
      if (uniques.length < hashtagCount) {
        errorString += 'Найдены повторяющиеся хэш-теги\n\r';
      } else if (hashtagCount > 5) {
        errorString += 'Допускается использование не более 5 хэш-тегов\n\r';
      }
    }
    return errorString;
  };

  var checkInputsValidity = function () {
    var flag = true;

    for (var i = 0; i < popupInputs.length; i++) {
      if (popupInputs[i].checkValidity() === false) {
        popupInputs[i].style = 'border: 3px solid red;';
        flag = false;
      } else {
        popupInputs[i].style = '';
      }
    }
    return flag;
  };

  hashtagInput.addEventListener('input', function () {
    hashtagInput.setCustomValidity(checkHashtagErrors(hashtagInput.value));
    checkInputsValidity();
  });

  commentInput.addEventListener('input', function (evt) {
    var target = evt.target;

    if (target.value.length > DESCRIPTION_MAX_LENGTH) {
      target.setCustomValidity(DESCRIPTION_ERROR);
    } else {
      target.setCustomValidity('');
    }
    checkInputsValidity();
  });

  buttonSubmit.addEventListener('click', function (evt) {
    if (!checkInputsValidity()) {
      evt.preventDefault();
    }
  });

  scalePinHandler.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoordX = evt.clientX;
    var calculateOffsetX = scalePinHandler.offsetLeft;
    var scaleLineWidth = scaleLine.clientWidth;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      calculateOffsetX -= startCoordX - moveEvt.clientX;
      if (calculateOffsetX < 0) {
        calculateOffsetX = 0;
      } else if (calculateOffsetX > scaleLineWidth) {
        calculateOffsetX = scaleLineWidth;
      }
      startCoordX = moveEvt.clientX;
      setEffectLevel(Math.floor(calculateOffsetX / scaleLineWidth * 100));
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
