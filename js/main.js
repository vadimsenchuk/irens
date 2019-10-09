'use strict'

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
};

function popup () {
    const buttons = document.querySelectorAll('.card__link');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const firstScriptTag = document.querySelector('script');
            const popup = document.createElement('div');
            const video = document.createElement('div');
            const closePopup = document.createElement('div');
            const tag = document.createElement('script');

            popup.classList.add('popup')
            video.classList.add('popup__video')
            closePopup.classList.add('popup__close')
            tag.src = "https://www.youtube.com/iframe_api"

            firstScriptTag.parentNode.insertBefore(popup, firstScriptTag);
            popup.appendChild(video);
            video.appendChild(closePopup);
            deletePopup(popup)
        })
    })
}

function deletePopup(elem) {
    elem.addEventListener('click', ({target}) => {
        if (target === elem || target.classList.contains('popup__close')) {
            elem.remove();
        }
    })
}