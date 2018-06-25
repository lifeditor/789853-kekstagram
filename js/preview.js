'use strict';

(function () {

  var BIG_PICTURE = '.big-picture';
  var CSS_PREFIX = '.social';
  var SOCIAL_TEMPLATE = '#social__comment';

  var bigPicture = document.querySelector(BIG_PICTURE);
  var buttonHide = bigPicture.querySelector('.big-picture__cancel');
  var commentList = bigPicture.querySelector(CSS_PREFIX + '__comments');

  var hide = function () {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };

  window.preview = {

    show: function () {
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', onEscPress);
    },

    setup: function (picture) {
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
        .appendChild(window.gallery.create(picture.comments, SOCIAL_TEMPLATE));
    },
  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, hide, []);
  };

  buttonHide.addEventListener('click', hide);

})();
