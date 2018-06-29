'use strict';

(function () {

  var Scale = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var Effect = {
    DEFAULT: 'effects__preview--none',
    DEFAULT_LEVEL: 100
  };

  var Description = {
    MAX_LENGTH: 140,
    ERROR_LENGTH: 'Длина описания больше 140 символов'
  };

  var Hashtag = {
    CHAR: '#',
    DIVIDER: ' ',
    MAX_LENGTH: 20
  };

  var filterStyle = {
    'effects__preview--none': {filter: function () {
      return 'filter: none;';
    }},
    'effects__preview--chrome': {filter: function (value) {
      return 'filter: grayscale(' + (value / 100) + ');';
    }},
    'effects__preview--sepia': {filter: function (value) {
      return 'filter: sepia(' + (value / 100) + ');';
    }},
    'effects__preview--marvin': {filter: function (value) {
      return 'filter: invert(' + value + '%);';
    }},
    'effects__preview--phobos': {filter: function (value) {
      return 'filter: blur(' + (value / 100 * 3) + 'px);';
    }},
    'effects__preview--heat': {filter: function (value) {
      return 'filter: brightness(' + (value / 100 * 2 + 1) + ');';
    }}
  };

  var popup = document.querySelector('.img-upload__overlay');
  var form = document.querySelector('.img-upload__form');
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
  var effectList = popup.querySelector('.effects__list');
  var popupInputs = [hashtagInput, commentInput];
  var cssStyle = {};

  var setStyle = function (element, style) {
    element.style = style.filter + style.transform;
  };

  var setEffectLevel = function (level) {
    scaleInput.setAttribute('value', level);
    scaleLevel.style.width = level + '%';
    scalePinHandler.style.left = level + '%';
    cssStyle.filter = filterStyle[preview.classList[1] || Effect.DEFAULT]
      .filter(level);
    scale.classList
      .toggle('hidden', cssStyle.filter === 'filter: none;');
    setStyle(preview, cssStyle);
  };

  var setPreviewSize = function (size) {
    resizeInput.setAttribute('value', size + '%');
    cssStyle.transform = 'transform: scale(' + (size / 100) + ');';
    setStyle(preview, cssStyle);
  };

  var hide = function () {
    window.error.hide();
    fileInput.value = '';
    popupInputs.forEach(function (value) {
      value.style = '';
      value.value = '';
      value.setCustomValidity('');
    });
    popup.querySelector('input[id="effect-none"]').checked = true;
    preview.classList.remove(preview.classList[1]);
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };

  window.form = {

    show: function () {
      setPreviewSize(Scale.MAX);
      setEffectLevel(Effect.DEFAULT_LEVEL);
      popup.classList.remove('hidden');
      document.addEventListener('keydown', onEscPress);
    },

  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, hide, popupInputs);
  };

  var onResizeClick = function (evt) {
    var resize = parseInt(resizeInput.value, 10);

    resize += (evt.target === resizePlus) ? Scale.STEP : -Scale.STEP;
    if (resize > Scale.MAX) {
      resize = Scale.MAX;
    } else if (resize < Scale.MIN) {
      resize = Scale.MIN;
    }
    setPreviewSize(resize);
  };

  buttonHide.addEventListener('click', hide);
  resizeMinus.addEventListener('click', onResizeClick);
  resizePlus.addEventListener('click', onResizeClick);

  effectList.addEventListener('click', function (evt) {
    var target = evt.target;

    if (target.classList.contains('effects__radio')) {
      preview.classList.remove(preview.classList[1]);
      preview.classList.add('effects__preview--' + target.value);
      setEffectLevel(Effect.DEFAULT_LEVEL);
    }
  });

  var checkHashtagErrors = function (hashtagString) {
    var errorString = '';

    if (hashtagString.length > 0) {
      var hashtags = hashtagString.toLowerCase().split(Hashtag.DIVIDER);
      var hashtagCount = hashtags.length;
      var uniques = [];

      hashtags.forEach(function (hashtag) {
        if (uniques.indexOf(hashtag) === -1) {
          uniques.push(hashtag);
        }
        var hashtagLength = hashtag.length;
        if (hashtagLength === 0) {
          errorString += 'Найден лишний пробел\n\r';
        } else if (hashtag[0] !== Hashtag.CHAR) {
          errorString += hashtag + ' - Хеш-тег должен начинаться с #\n\r';
        } else if (hashtagLength > Hashtag.MAX_LENGTH) {
          errorString += hashtag + ' - Длина хэш-тега превышает ' +
           Hashtag.MAX_LENGTH + ' символов\n\r';
        } else if (hashtag === Hashtag.CHAR) {
          errorString += hashtag + ' - Хеш-тег введен неправильно\n\r';
        } else if (hashtag.indexOf(Hashtag.CHAR, 1) > 0) {
          errorString += hashtag + ' - Хэш-теги должны разделяться пробелом\n\r';
        }
      });

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

    popupInputs.forEach(function (value) {
      if (!value.checkValidity()) {
        value.style = 'border: 3px solid red;';
        flag = false;
      } else {
        value.style = '';
      }
    });
    return flag;
  };

  hashtagInput.addEventListener('input', function () {
    hashtagInput.setCustomValidity(checkHashtagErrors(hashtagInput.value));
    checkInputsValidity();
  });

  commentInput.addEventListener('input', function (evt) {
    var target = evt.target;

    if (target.value.length > Description.MAX_LENGTH) {
      target.setCustomValidity(Description.ERROR_LENGTH);
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

  form.addEventListener('submit', function (evt) {
    var successHandler = function () {
      window.error.hide();
      hide();
    };

    var errorHandler = function (errorMessage) {
      window.error.show(errorMessage);
    };

    var oData = new FormData(form);
    window.backend.upload(successHandler, errorHandler, oData);
    evt.preventDefault();

  });

})();
