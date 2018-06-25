'use strict';

(function () {

  var PICTURE_TEMPLATE = '#picture';

  window.gallery = {

    create: function (arrays, templateID) {
      var selector = (templateID === PICTURE_TEMPLATE) ?
        '.picture__link' : '.social__comment';
      var elementTemplate = document.querySelector(templateID)
      .content
      .querySelector(selector);
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < arrays.length; i++) {
        var element = elementTemplate.cloneNode(true);

        fragment.appendChild(
            (templateID === PICTURE_TEMPLATE) ?
              window.picture.setup(arrays[i], element) :
              window.picture.setupComment(arrays[i], element)
        );
      }
      return fragment;
    }

  };

})();
