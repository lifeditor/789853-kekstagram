'use strict';

(function () {

  var gallery = document.querySelector('.pictures');
  var buttonUploadStart = gallery.querySelector('.img-upload__start');

  var successHandler = function (pictures) {
    gallery
    .appendChild(window.gallery.create(pictures, '#picture'));

    document.addEventListener('click', function (evt) {
      var target = evt.target;

      if (target.classList.contains('picture__img')) {
        window.preview.setup(pictures[target.id]);
        window.preview.show();
      }
    });

    buttonUploadStart.addEventListener('change', window.form.show);
  };

  var errorHandler = function (errorMessage) {
    window.error.show(errorMessage);
  };

  window.backend.load(successHandler, errorHandler);

})();
