'use strict';

const firstScriptTag = document.querySelector('script');
const $tag = document.createElement('script');
const $popup = document.createElement('div');
const $video = document.createElement('div');
const $closePopup = document.createElement('div');
let videoId = '';

$popup.className = 'popup';
$video.className = 'popup__video';
$video.id = 'player';
$closePopup.className = 'popup__close';
$tag.src = 'https://www.youtube.com/iframe_api';

firstScriptTag.parentNode.insertBefore($popup, firstScriptTag);
$popup.appendChild($video);
$popup.appendChild($closePopup);

fetch('./store/data.json')
  .then(res => res.json())
  .then(data => getTemplate(data));

function getTemplate(arr) {
  fetch('./template/cards.html')
    .then(res => res.text())
    .then(tpl => {
      const template = _.template(tpl);
      const card = arr.reduce((a, b) => a + template(b), '');
      document.querySelector('.container').innerHTML = card;
      popup();
    });
}

function popup() {
  const buttons = document.querySelectorAll('.card__link');
  buttons.forEach(button => {
    showPopup(button);
  });
}

function showPopup(elem) {
  elem.addEventListener('click', () => {
    videoId = elem.getAttribute('data-video').split('=')[1];
    $popup.classList.add('visible');
    firstScriptTag.parentNode.insertBefore($tag, firstScriptTag);

    hidePopup($popup, elem);

    if (document.hasChildNodes($tag)) {
      onYouTubePlayerAPIReady();
    }
  });
}

function hidePopup(elem, button) {
  elem.addEventListener('click', ({ target }) => {
    if (target === elem || target.classList.contains('popup__close')) {
      elem.classList.remove('visible');
      clearVideo(button);
    }
  });
}

let player;
function onYouTubePlayerAPIReady() {
  let width = 640;
  if (window.screen.width < 640) {
    width = window.screen.width;
  }
  player = new YT.Player('player', {
    width,
    videoId,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  // console.log(event);
  if (event.data == 0) {
    setTimeout(nextVideo, 10000);
  }
}

function stopVideo() {
  player.stopVideo();
}

function nextVideo() {
  const playlist = [];
  const url = player.getVideoUrl().split('=')[2];

  document.querySelectorAll('.card__link').forEach(el => {
    playlist.push(el.getAttribute('data-video').split('=')[1]);
  });

  let currentVideo = playlist.indexOf(url);
  if (currentVideo == playlist.length - 1) {
    currentVideo = -1;
  }
  const nextVideo = playlist.slice(++currentVideo, ++currentVideo).toString();
  console.log(playlist, url);
  player.cueVideoById(nextVideo, 0);
  player.nextVideo();
  player.playVideo();
}

function clearVideo(elem) {
  player.destroy();
  const duration = player.getDuration();
  const time = player.getCurrentTime();
  let res = (time / duration) * 100;
  if (res < 25) {
    res = 0;
  } else if (res < 50) {
    res = 25;
  } else if (res < 75) {
    res = 50;
  } else if (res < 100) {
    res = 75;
  } else {
    res = 100;
  }
  const title = elem.parentElement.querySelector('.card__title').textContent;
  const id = player.getVideoUrl().split('=')[1];
  console.log(title + ' - ' + id + ' - ' + res + '%');
}

$(() => {
  setTimeout(() => {
    if (window.screen.width <= 768) {
      $('.container').slick({
        dots: true
      });
    }
  }, 100);
  if (window.screen.width < 640) {
    $('iframe').attr('width', '100%');
  }
});
