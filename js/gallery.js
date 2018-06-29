'use strict';

(function () {

  var PICTURE_TEMPLATE = '#picture';
  var POPULAR_COUNT = 10;
  var ACTIVE_BUTTON_CLASS = 'img-filters__button--active';

  var gallery = document.querySelector('.pictures');

  var galleryFilter = {

    'filter-popular': {set: function (pictures) {
      return pictures.slice();
    }},

    'filter-new': {set: function (pictures) {
      var filteredPictures = [];
      var pictureCount = pictures.length;

      for (var i = 0; i < POPULAR_COUNT; i++) {
        do {
          var elem =
            (pictures[window.util
              .generateRandom(0, pictureCount - 1)]);
        }
        while (filteredPictures.indexOf(elem) !== -1);
        filteredPictures.push(elem);
      }

      return filteredPictures;
    }},

    'filter-discussed': {set: function (pictures) {
      var mapped = pictures.map(function (el, ind) {
        return {index: ind, value: el.comments.length};
      });

      mapped.sort(function (a, b) {
        if (a.value < b.value) {
          return 1;
        }
        if (a.value > b.value) {
          return -1;
        }
        return 0;
      });

      var filteredPictures = mapped.map(function (el) {
        return pictures[el.index];
      });

      return filteredPictures;
    }}
  };

  window.gallery = {

    create: function (arrays, templateID) {
      var selector = (templateID === PICTURE_TEMPLATE) ?
        '.picture__link' : '.social__comment';
      var elementTemplate = document.querySelector(templateID)
        .content
        .querySelector(selector);
      var fragment = document.createDocumentFragment();

      arrays.forEach(function (value, index) {
        var element = elementTemplate.cloneNode(true);

        element.id = index;
        fragment.appendChild(
            (templateID === PICTURE_TEMPLATE) ?
              window.picture.setup(value, element) :
              window.picture.setupComment(value, element)
        );
      });

      return fragment;
    },

    filter: function (filter, pictures) {
      filter.parentElement.querySelector('.' + ACTIVE_BUTTON_CLASS)
        .classList.remove(ACTIVE_BUTTON_CLASS);
      filter.classList.add(ACTIVE_BUTTON_CLASS);

      return galleryFilter[filter.id].set(pictures);
    },

    update: function (pictures) {
      var pictureLinkCollection = gallery.querySelectorAll('.picture__link');

      [].forEach.call(pictureLinkCollection, function (pictureLink) {
        gallery.removeChild(pictureLink);
      });
      gallery
        .appendChild(window.gallery.create(pictures, '#picture'));

    }
  };

})();
