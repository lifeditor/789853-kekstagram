'use strict';

(function () {

  var RESPONSE_OK = 200;
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var URL = 'https://js.dump.academy/kekstagram/data';

  var createRequest = function (onLoad, onError, method, url) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_OK) {
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
      var xhr = createRequest(onLoad, onError, 'GET', URL);
      xhr.send();
    },

    upload: function (onLoad, onError, Data) {
      var xhr = createRequest(onLoad, onError, 'POST', UPLOAD_URL);
      xhr.send(Data);
    }

  };

})();
