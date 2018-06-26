'use strict';

(function () {

  var AVATAR_COUNT = 6;
  var PICTURE = '.picture';

  window.picture = {

    setup: function (picture, element) {
      var image = element.querySelector(PICTURE + '__img');

      image.src = picture.url;
      image.id = element.id;
      element.querySelector(PICTURE + '__stat--likes')
        .textContent = picture.likes;
      element.querySelector(PICTURE + '__stat--comments')
        .textContent = picture.comments.length;
      return element;
    },

    setupComment: function (comment, element) {
      var textNode = document.createTextNode(comment);

      element.querySelector('.social__picture').src =
        'img/avatar-' + window.util.generateRandom(1, AVATAR_COUNT) + '.svg';
      element.appendChild(textNode);
      return element;
    }

  };

})();
