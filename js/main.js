'use strict';

(function () {

  var buttonUploadStart = document.querySelector('.img-upload__start');
  var sectionFilter = document.querySelector('.img-filters');
  var formFilter = sectionFilter.querySelector('.img-filters__form');
  var filteredPictures = [];

  var updateGallery = function () {
    window.gallery.update(filteredPictures);
  };

  var successHandler = function (pictures) {

    filteredPictures = pictures.slice();

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

    sectionFilter.classList.remove('img-filters--inactive');

    updateGallery();

  };

  var errorHandler = function (errorMessage) {
    window.error.show(errorMessage);
  };

  window.backend.load(successHandler, errorHandler);

})();
