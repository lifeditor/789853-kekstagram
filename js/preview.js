'use strict';

(function () {

  var COMMENT_SHOW_MAX = 5;
  var DESCRIPTION_ERROR = 'Описание фотографии не получено с сервера!';

  var Css = {
    TEMPLATE: '#social__comment',
    VISUALLY_HIDDEN: 'visually-hidden',
    MODAL_OPEN: 'modal-open',
    HIDDEN: 'hidden'
  };

  var bigPicture = document.querySelector('.big-picture');
  var buttonHide = bigPicture.querySelector('.big-picture__cancel');
  var commentList = bigPicture.querySelector('.social__comments');
  var buttonShowMore = bigPicture.querySelector('.social__loadmore');
  var commentShowElement = bigPicture.querySelector('.comments-show');
  var imageElement = bigPicture.querySelector('.big-picture__img');
  var likeCountElement = bigPicture.querySelector('.likes-count');
  var commentCountElement = bigPicture.querySelector('.comments-count');
  var descriptionElement = bigPicture.querySelector('.social__caption');
  var commentInput = bigPicture.querySelector('.social__footer-text');

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
    commentShowElement
      .textContent = commentShow;
  };

  var onButtonHideClick = function () {
    bigPicture.classList.add(Css.HIDDEN);
    bigPicture.classList.remove(Css.MODAL_OPEN);
    document.removeEventListener('keydown', onEscPress);
  };

  var setup = function (picture) {
    imageElement
      .children[0].src = picture.url;
    likeCountElement
      .textContent = picture.likes;
    commentCountElement
      .textContent = picture.comments.length;
    descriptionElement
      .textContent = picture.description || DESCRIPTION_ERROR;

    while (commentList.firstChild) {
      commentList.removeChild(commentList.firstChild);
    }
    commentList
      .appendChild(window.gallery
        .create(picture.comments,
            window.util.getElementTemplate(Css.TEMPLATE, 'social__comment')));
  };

  window.preview = {

    show: function (picture) {
      setup(picture);
      loadComment();
      bigPicture.classList.remove(Css.HIDDEN);
      bigPicture.classList.add(Css.MODAL_OPEN);
      document.addEventListener('keydown', onEscPress);
    }

  };

  var onEscPress = function (evt) {
    window.util.isEscEvent(evt, onButtonHideClick, [commentInput]);
  };

  buttonHide.addEventListener('click', onButtonHideClick);

  buttonShowMore.addEventListener('click', function () {
    loadComment();
  });

})();
