'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    isEscEvent: function (evt, action, activeElements) {
      if (evt.keyCode === ESC_KEYCODE) {
        var flag = true;
        for (var i = 0; i < activeElements.length; i++) {
          if (document.activeElement === activeElements[i]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          action();
        }
      }
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    generateRandom: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  };

})();
