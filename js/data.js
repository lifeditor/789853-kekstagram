'use strict';

(function () {

  var PICTURE_COUNT = 25;
  var COMMENT_COUNT = 2;

  var Like = {
    MIN: 15,
    MAX: 200
  };

  var descriptions = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var descLength = descriptions.length;
  var commentMaxIndex = comments.length - 1;

  var generateUniqueComment = function (arrays) {
    var string;

    do {
      string = comments[window.util.generateRandom(0, commentMaxIndex)];
    } while (arrays.indexOf(string) !== -1);

    return string;
  };

  window.data = {
    create: function () {
      var pictures = [];

      for (var i = 0; i < PICTURE_COUNT; i++) {
        var pictureObj = {};
        var strings = [];

        for (var cnt = 0; cnt < COMMENT_COUNT; cnt++) {
          strings[cnt] = generateUniqueComment(strings);
        }
        pictureObj.id = i;
        pictureObj.url = 'photos/' + (i + 1) + '.jpg';
        pictureObj.likes = window.util.generateRandom(Like.MIN, Like.MAX);
        pictureObj.comments = strings;
        pictureObj.description =
      descriptions[window.util.generateRandom(0, descLength - 1)];
        pictures[i] = pictureObj;
      }
      return pictures;
    }
  };
})();
