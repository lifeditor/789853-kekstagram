'use strict';

(function () {

  var buttonUploadStart = document.querySelector('.img-upload__start');
  var formFilter = document.querySelector('.img-filters__form');

  var successHandler = function (pictures) {

    var filteredPictures = pictures.slice();

    var updateGallery = function () {
      window.gallery.update(filteredPictures);
    };

    formFilter.addEventListener('click', function (evt) {
      filteredPictures = window.gallery.filter(evt.target, pictures);
      window.debounce(updateGallery);
    });

    document.addEventListener('click', function (evt) {
      var target = evt.target;

      if (target.classList.contains('picture__img')) {
        window.preview.show(filteredPictures[target.id]);
      }
    });

    buttonUploadStart.addEventListener('change', window.form.show);

    document.querySelector('.img-filters')
      .classList.remove('img-filters--inactive');

    updateGallery();
  };

  var errorHandler = function (errorMessage) {
    window.error.show(errorMessage);
  };

  window.backend.load(successHandler, errorHandler);

})();
