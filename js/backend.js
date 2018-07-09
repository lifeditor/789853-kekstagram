'use strict';

(function () {

  var SUCCESS_CODE = 200;

  var Url = {
    UPLOAD: 'https://js.dump.academy/kekstagram',
    LOAD: 'https://js.dump.academy/kekstagram/data'
  };

  var createRequest = function (onLoad, onError, method, url) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s
    xhr.open(method, url);

    return xhr;
  };

  window.backend = {

    load: function (onLoad, onError) {
      var xhr = createRequest(onLoad, onError, 'GET', Url.LOAD);
      xhr.send();
    },

    upload: function (onLoad, onError, data) {
      var xhr = createRequest(onLoad, onError, 'POST', Url.UPLOAD);
      xhr.send(data);
    }

  };

})();
