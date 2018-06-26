'use strict';

(function () {

  var BIG_PICTURE = '.big-picture';
  var CSS_PREFIX = '.social';
  var SOCIAL_TEMPLATE = '#social__comment';
  var VISUALLY_HIDDEN = 'visually-hidden';
  var MODAL_OPEN = 'modal-open';
  var HIDDEN = 'hidden';
  var COMMENT_SHOW_MAX = 5;

  var bigPicture = document.querySelector(BIG_PICTURE);
  var buttonHide = bigPicture.querySelector('.big-picture__cancel');
  var commentList = bigPicture.querySelector(CSS_PREFIX + '__comments');
  var buttonShowMore = bigPicture.querySelector('.social__loadmore');

  var loadComment = function () {
    var commentCount = commentList.children.length;
    var commentShow = commentCount -
      commentList.querySelectorAll('.' + VISUALLY_HIDDEN).length;

    commentShow += COMMENT_SHOW_MAX;
    if (commentShow > commentCount) {
      commentShow = commentCount;
    }
    for (var i = 0; i < commentShow; i++) {
      commentList.children[i].classList.remove(VISUALLY_HIDDEN);
    }
    buttonShowMore.classList
      .toggle(VISUALLY_HIDDEN, commentCount < commentShow + 1);
  };

  var hide = function () {
    bigPicture.classList.add(HIDDEN);
    bigPicture.classList.remove(MODAL_OPEN);
    document.removeEventListener('keydown', onEscPress);
  };

  window.preview = {

    show: function () {
      loadComment();
      bigPicture.classList.remove(HIDDEN);
      bigPicture.classList.add(MODAL_OPEN);
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

  buttonShowMore.addEventListener('click', function () {
    loadComment();
  });

})();
