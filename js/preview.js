'use strict';

(function () {

  var COMMENT_SHOW_MAX = 5;
  var DESCRIPTION_ERROR = 'Описание фотографии не получено с сервера!';

  var Css = {
    BIG_PICTURE: '.big-picture',
    PREFIX: '.social',
    TEMPLATE: '#social__comment',
    VISUALLY_HIDDEN: 'visually-hidden',
    MODAL_OPEN: 'modal-open',
    HIDDEN: 'hidden'
  };

  var bigPicture = document.querySelector(Css.BIG_PICTURE);
  var buttonHide = bigPicture.querySelector('.big-picture__cancel');
  var commentList = bigPicture.querySelector(Css.PREFIX + '__comments');
  var buttonShowMore = bigPicture.querySelector('.social__loadmore');

  var loadComment = function () {
    var commentCount = commentList.children.length;
    var commentShow = commentCount -
      commentList.querySelectorAll('.' + Css.VISUALLY_HIDDEN).length;

    commentShow += COMMENT_SHOW_MAX;
    if (commentShow > commentCount) {
      commentShow = commentCount;
    }
    for (var i = 0; i < commentShow; i++) {
      commentList.children[i].classList.remove(Css.VISUALLY_HIDDEN);
    }
    buttonShowMore.classList
      .toggle(Css.VISUALLY_HIDDEN, commentCount < commentShow + 1);
    bigPicture.querySelector('.comments-show').textContent = commentShow;
  };

  var hide = function () {
    bigPicture.classList.add(Css.HIDDEN);
    bigPicture.classList.remove(Css.MODAL_OPEN);
    document.removeEventListener('keydown', onEscPress);
  };

  window.preview = {

    setup: function (picture) {
      bigPicture.querySelector(Css.BIG_PICTURE + '__img')
        .children[0].src = picture.url;
      bigPicture.querySelector('.likes-count')
        .textContent = picture.likes;
      bigPicture.querySelector('.comments-count')
        .textContent = picture.comments.length;
      bigPicture.querySelector(Css.PREFIX + '__caption')
        .textContent = picture.description || DESCRIPTION_ERROR;

      while (commentList.firstChild) {
        commentList.removeChild(commentList.firstChild);
      }
      commentList
        .appendChild(window.gallery.create(picture.comments, Css.TEMPLATE));
    },

    show: function (picture) {
      window.preview.setup(picture);
      loadComment();
      bigPicture.classList.remove(Css.HIDDEN);
      bigPicture.classList.add(Css.MODAL_OPEN);
      document.addEventListener('keydown', onEscPress);
    }

  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, hide, []);
  };

  buttonHide.addEventListener('click', hide);

  buttonShowMore.addEventListener('click', function () {
    loadComment();
  });

})();
