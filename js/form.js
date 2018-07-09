'use strict';

(function () {

  var Size = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };

  var Effect = {
    DEFAULT: 'effects__preview--none',
    MAX: 100,
    BLUR_MAX: 3,
    BRIGHTNESS_MIN: 1,
    BRIGHTNESS_MAX: 3
  };

  var Description = {
    MAX_LENGTH: 140,
    ERROR_LENGTH: 'Длина описания больше 140 символов'
  };

  var Hashtag = {
    CHAR: '#',
    DIVIDER: ' ',
    MAX_LENGTH: 20,
    MAX_COUNT: 5
  };

  var filterStyle = {
    'effects__preview--none': {filter: function () {
      return 'filter: none;';
    }},
    'effects__preview--chrome': {filter: function (value) {
      return 'filter: grayscale(' + (value / Effect.MAX) + ');';
    }},
    'effects__preview--sepia': {filter: function (value) {
      return 'filter: sepia(' + (value / Effect.MAX) + ');';
    }},
    'effects__preview--marvin': {filter: function (value) {
      return 'filter: invert(' + value + '%);';
    }},
    'effects__preview--phobos': {filter: function (value) {
      return 'filter: blur(' + (value / Effect.MAX * Effect.BLUR_MAX) + 'px);';
    }},
    'effects__preview--heat': {filter: function (value) {
      return 'filter: brightness(' + (value / Effect.MAX *
        (Effect.BRIGHTNESS_MAX - Effect.BRIGHTNESS_MIN) + Effect.BRIGHTNESS_MIN) + ');';
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
  var buttonSizeMinus = popup.querySelector('.resize__control--minus');
  var buttonSizePlus = popup.querySelector('.resize__control--plus');
  var sizeInput = popup.querySelector('.resize__control--value');
  var hashtagInput = popup.querySelector('.text__hashtags');
  var buttonSubmit = popup.querySelector('.img-upload__submit');
  var effectList = popup.querySelector('.effects__list');
  var defaultEffectInput = popup.querySelector('input[id="effect-none"]');
  var formInputs = [hashtagInput, commentInput];
  var previewImage = preview.children[0];
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
    sizeInput.setAttribute('value', size + '%');
    cssStyle.transform = 'transform: scale(' + (size / Size.MAX) + ');';
    setStyle(preview, cssStyle);
  };

  var onButtonHideClick = function () {
    window.error.hide();
    fileInput.value = '';
    formInputs.forEach(function (value) {
      value.style = '';
      value.value = '';
      value.setCustomValidity('');
    });
    defaultEffectInput.checked = true;
    preview.classList.remove(preview.classList[1]);
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };

  window.form = {

    show: function () {
      previewImage.src = window.URL.createObjectURL(fileInput.files[0]);
      setPreviewSize(Size.MAX);
      setEffectLevel(Effect.MAX);
      popup.classList.remove('hidden');
      document.addEventListener('keydown', onEscPress);
    },

  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, onButtonHideClick, formInputs);
  };

  var onButtonSizeClick = function (evt) {
    var resize = parseInt(sizeInput.value, 10);

    resize += (evt.target === buttonSizePlus) ? Size.STEP : -Size.STEP;
    if (resize > Size.MAX) {
      resize = Size.MAX;
    } else if (resize < Size.MIN) {
      resize = Size.MIN;
    }
    setPreviewSize(resize);
  };

  buttonHide.addEventListener('click', onButtonHideClick);
  buttonSizeMinus.addEventListener('click', onButtonSizeClick);
  buttonSizePlus.addEventListener('click', onButtonSizeClick);

  effectList.addEventListener('click', function (evt) {
    var target = evt.target;

    if (target.classList.contains('effects__radio')) {
      preview.classList.remove(preview.classList[1]);
      preview.classList.add('effects__preview--' + target.value);
      setEffectLevel(Effect.MAX);
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
          errorString += hashtag + ' - Хеш-тег должен начинаться с ' +
            Hashtag.CHAR + '\n\r';
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
      } else if (hashtagCount > Hashtag.MAX_COUNT) {
        errorString += 'Допускается использование не более ' +
          Hashtag.MAX_COUNT + ' хэш-тегов\n\r';
      }
    }
    return errorString;
  };

  var checkValidity = function () {
    var flag = true;

    formInputs.forEach(function (value) {
      value.style = value.checkValidity() ? '' : 'border: 3px solid red;';
    });

    try {
      flag = form.reportValidity();
    } catch (err) {
      // метод reportValidity() не поддерживается браузером
      flag = form.checkValidity();
    }
    return flag;
  };

  buttonSubmit.addEventListener('click', function (evt) {
    if (!checkValidity()) {
      evt.preventDefault();
    }
  });

  form.addEventListener('input', function (evt) {
    var target = evt.target;

    if (target === hashtagInput) {
      target.setCustomValidity(checkHashtagErrors(target.value));
    } else if (target.value.length > Description.MAX_LENGTH) {
      target.setCustomValidity(Description.ERROR_LENGTH);
    } else {
      target.setCustomValidity('');
    }
    checkValidity();

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
      setEffectLevel(Math.floor(calculateOffsetX / scaleLineWidth * Effect.MAX));
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
      onButtonHideClick();
    };

    var errorHandler = function (errorMessage) {
      window.error.show(errorMessage);
    };

    var oData = new FormData(form);
    window.backend.upload(successHandler, errorHandler, oData);
    evt.preventDefault();

  });

})();
