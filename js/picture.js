'use strict';

(function () {

  var AVATAR_COUNT = 6;

  window.picture = {

    setup: function (picture, imageElement, pictureInfo) {

      imageElement.src = picture.url;
      pictureInfo.children[0].textContent = picture.comments.length;
      pictureInfo.children[1].textContent = picture.likes;

    },

    setupComment: function (comment, imageElement) {
      var textNode = document.createTextNode(comment);

      imageElement.src =
        'img/avatar-' + window.util.generateRandom(1, AVATAR_COUNT) + '.svg';
      imageElement.parentElement.appendChild(textNode);

    }

  };

})();
