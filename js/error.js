'use strict';

(function () {

  var ERROR_SELECTOR = '.img-upload__message--error';
  var HIDDEN = 'hidden';

  var hideErrorPopup = function () {
    var errorCount = document.querySelectorAll(ERROR_SELECTOR).length;
    if (errorCount > 0) {
      document.querySelector(ERROR_SELECTOR)
        .classList.add(HIDDEN);
    }
  };

  window.error = {

    show: function (errorMessage) {
      var elementTemplate = document.querySelector('#picture')
        .content
        .querySelector(ERROR_SELECTOR);
      var element = elementTemplate.cloneNode(true);

      element.classList.remove(HIDDEN);
      element.style =
        'z-index: 100; margin: 0 auto; text-align: center; background-color: maroon;';
      element.style.position = 'absolute';
      element.style.top = '50%';
      element.style.left = '0px';
      element.style.fontSize = '20px';
      element.children[0].addEventListener('click', hideErrorPopup);
      var textNode = document
        .createTextNode(element.firstChild.textContent + '. ' + errorMessage);
      element.replaceChild(textNode, element.firstChild);
      document.body.insertAdjacentElement('afterbegin', element);

    },

    hide: function () {
      hideErrorPopup();
    }

  };

})();
