'use strict';

(function () {

  var Key = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    isEscEvent: function (evt, action, inputs) {
      if (evt.keyCode === Key.ESC &&
          inputs.indexOf(document.activeElement) === -1) {
        action();
      }
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === Key.ENTER) {
        action();
      }
    },

    generateRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getElementTemplate: function (templateID, selector) {
      var elementTemplate = document.querySelector(templateID)
        .content
        .querySelector('.' + selector);

      return elementTemplate;
    }

  };

})();
