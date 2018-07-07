'use strict';

(function () {

  var ERROR_CLASS = 'img-upload__message--error';
  var HIDDEN = 'hidden';
  var errorPopup;

  var onHideClick = function () {
    if (errorPopup) {
      errorPopup.classList.add(HIDDEN);
    }
  };

  window.error = {

    show: function (errorMessage) {
      errorPopup = window.util
        .getElementTemplate('#picture', ERROR_CLASS).cloneNode(true);

      errorPopup.classList.remove(HIDDEN);
      errorPopup.style =
        'z-index: 100; margin: 0 auto; text-align: center; background-color: maroon;';
      errorPopup.style.position = 'absolute';
      errorPopup.style.top = '50%';
      errorPopup.style.left = '0px';
      errorPopup.style.fontSize = '20px';
      errorPopup.children[0].addEventListener('click', onHideClick);
      var textNode = document
        .createTextNode(errorPopup.firstChild.textContent + '. ' + errorMessage);
      errorPopup.replaceChild(textNode, errorPopup.firstChild);
      document.body.insertAdjacentElement('afterbegin', errorPopup);

    },

    hide: function () {
      onHideClick();
    }

  };

})();
