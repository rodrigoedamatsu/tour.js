/**
 * @module Tour
 * A tour.js é uma lib open source sem dependências externas, que nasceu da necessidade de guiar o usuário
 * por uma solução web complexa explicando-a como funciona, porém com o desafio
 * e a necessidade de ter recursos para ser acessível aos surdos.
 *
 * @author rodrigoedamatsu@gmail.com
 */
var Tour = (function () {
    'use strict';

    /**
     * @typedef     {Object}            TourStepModel
     * @property    {Number}            step
     * @property    {String}            message
     * @property    {String}            ref
     * @property    {String}            [position=left]
     * @property    {String}            [image]
     * @property    {String}            [video]
     * @property    {String}            [color]
     * @property    {String}            [fontColor]
     */

        // HTMLElements
    var box;
    var content;
    var resource;
    var btnClose;
    var action;
    var overlay;

    // controllers
    var steps = [];
    var currStep = 0;
    var cacheZIndex = 0;

    var config = {
        btnBack: 'Voltar',
        btnNext: 'Avançar',
        defaultPosition: 'right',

        steps: []
    };

    /**
     * @param       _config
     */
    function init(_config) {

        _config = _config || {};

        config = {
            btnBack: _config.btnBack || 'Voltar',
            btnNext: _config.btnNext || 'Avançar',
            defaultPosition: _config.defaultPosition || 'right',
            backdrop: _config.hasOwnProperty('backdrop') ? _config.backdrop : true,
            zIndex: 99999,
            steps: _config.steps || [],

            template: '<button class="tour-close">X</button>' +
            '<div class="tour-resource"></div>' +
            '<div class="tour-message"></div><' +
            'div class="tour-action">' +
            '<button class="tour-step-back"></button>' +
            '<button class="tour-step-next"></button>' +
            '</div>'
        };

        getSteps();
        createStep();
        createBackdrop();
    }

    function getSteps() {

        var elements = document.querySelectorAll('[data-step]');

        for (var i = 0, len = elements.length; i < len; i++) {
            config.steps.push({
                step: parseInt(elements[i].getAttribute('data-step')),
                message: elements[i].getAttribute('data-message'),
                position: elements[i].getAttribute('data-position'),
                video: elements[i].getAttribute('data-video'),
                image: elements[i].getAttribute('data-image'),
                color: elements[i].getAttribute('data-color'),
                fontColor: elements[i].getAttribute('data-font-color'),
                ref: elements[i]
            });
        }

        config.steps.sort(sortByStep);
    }

    function sortByStep(a, b) {
        return a.step - b.step
    }

    function createStep() {
        createBox();
        setPosition();
    }

    function createBox() {
        box = document.createElement('div');
        box.classList.add('tour-box');
        box.style.backgroundColor = config.steps[currStep].color || '';
        box.innerHTML = config.template;

        if (typeof config.steps[currStep].ref === 'string') {
            config.steps[currStep].ref = document.querySelector(config.steps[currStep].ref);
        }

        config.steps[currStep].ref.appendChild(box);

        configCloseButton();
        setContent();
        createResource();

        configButtons();
    }

    function configCloseButton() {
        btnClose = box.getElementsByClassName('tour-close')[0];
        btnClose.addEventListener('mousedown', closeTour);
    }

    function setContent() {
        content = box.getElementsByClassName('tour-message')[0];
        content.innerHTML = config.steps[currStep].message;
        content.style.color = config.steps[currStep].fontColor || '';
    }

    function createResource() {
        if (config.steps[currStep].video || config.steps[currStep].image) {

            resource = document.getElementsByClassName('tour-resource')[0];
            createImage();
            createVideo();
        }
    }

    function createVideo() {
        var video = config.steps[currStep].video;

        if (video) {

            var elemVideo = document.createElement('video');
            elemVideo.src = video;
            elemVideo.autoplay = true;
            elemVideo.controls = true;

            resource.appendChild(elemVideo);
        }
    }

    function createImage() {
        var image = config.steps[currStep].image;

        if (image) {

            var elemImage = document.createElement('img');
            elemImage.src = image;

            resource.appendChild(elemImage);
        }
    }

    function configButtons() {
        var btnBack = box.getElementsByClassName('tour-step-back')[0];
        btnBack.textContent = config.btnBack;

        if (currStep === 0) {
            btnBack.disabled = true;
        }

        btnBack.addEventListener('mousedown', backStep);

        var btnNext = document.getElementsByClassName('tour-step-next')[0];
        btnNext.textContent = config.btnNext;

        if (currStep === steps.length - 1) {
            btnNext.disabled = true;
        }

        btnNext.addEventListener('mousedown', nextStep);
    }

    function createBackdrop() {
        if (config.backdrop) {
            overlay = document.createElement('div');
            overlay.classList.add('tour-overlay');
            overlay.style.zIndex = config.zIndex - 10;

            document.body.insertBefore(overlay, document.body.firstChild);
        }
    }

    function removeBackdrop() {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    function setPosition() {

        var ref = config.steps[currStep].ref;
        var refRect = ref.getBoundingClientRect();
        var top = 0;
        var left = 0;
        var offset = 10;
        var position = config.steps[currStep].position || config.defaultPosition;

        if (ref.style.position === '') {
            ref.style.position = 'relative';
        }

        if (position === 'right') {
            left = (refRect.width + offset);

        } else if (position === 'left') {
            left = (box.offsetWidth + offset) * -1;

        } else if (position === 'top') {
            top = (box.offsetHeight + offset) * -1;

        } else if (position === 'bottom') {
            top = refRect.height + offset;
        }

        box.style.left = left + 'px';
        box.style.top = top + 'px';

        cacheZIndex = ref.style.zIndex;
        ref.style.zIndex = config.zIndex;
        box.style.zIndex = config.zIndex;
        document.body.scrollTop = refRect.top;
    }

    function removeStep() {
        config.steps[currStep].ref.style.zIndex = cacheZIndex;

        box.parentNode.removeChild(box);
    }

    function backStep() {
        if (currStep > 0) {
            removeStep();

            currStep--;
            createStep();
        }
    }

    function nextStep() {
        if (currStep < config.steps.length - 1) {
            removeStep();

            currStep++;
            createStep();
        }
    }

    function closeTour() {
        removeStep();
        removeBackdrop();
        config.steps = [];
        currStep = 0;
    }

    return {
        init: init,
        next: nextStep,
        back: backStep
    }
})();