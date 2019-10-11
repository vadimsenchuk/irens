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

    hidePopup($popup);

    if (document.hasChildNodes($tag)) {
      onYouTubePlayerAPIReady();
      console.log(getDuration());
    }
  });
}

function hidePopup(elem) {
  elem.addEventListener('click', ({ target }) => {
    if (target === elem || target.classList.contains('popup__close')) {
      elem.classList.remove('visible');
      clearVideo();
    }
  });
}

let player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
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

let done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
}

function clearVideo() {
  player.destroy();
}

function getDuration() {
  const duration = player.getDuration();
  return duration;
}
