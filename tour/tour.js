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

    var steps = [];
    var config = [];
    var currStep = 0;

    /**
     * @param       {TourStepModel[]}   _config
     */
    function init(_config) {

        if (_config && Array.isArray(_config)) {
            config = _config;
        }

        getSteps();
        createStep();
        createOverlay();
    }

    function getSteps() {

        var elements = document.querySelectorAll('[data-step]');

        for (var i = 0, len = elements.length; i < len; i++) {
            steps.push(prepareModel(elements[i]));
        }

        insertCustomConfig();

        steps.sort(sortByStep);
    }

    function prepareModel(_elem) {
        return {
            step: parseInt(_elem.getAttribute('data-step')),
            message: _elem.getAttribute('data-message'),
            position: _elem.getAttribute('data-position') || 'right',
            video: _elem.getAttribute('data-video'),
            image: _elem.getAttribute('data-image'),
            color: _elem.getAttribute('data-color'),
            fontColor: _elem.getAttribute('data-font-color'),
            ref: _elem
        }
    }

    // TODO: OTIMIZAR
    function insertCustomConfig() {

        for (var i = 0, len = config.length; i < len; i++) {

            var step = steps.find(function (model) {
                return model.step === config[i].step;
            });

            // reconfigura etapa existente
            if (step) {

                step.message = config[i].message || step.message;
                step.position = config[i].position || step.position;
                step.video = config[i].video || step.video;
                step.ref = document.querySelector(config[i].ref) || step.ref;
                step.color = config[i].color || step.color;
                step.fontColor = config[i].fontColor || step.fontColor;

                // cria nova etapa
            } else {

                steps.push({
                    step: config[i].step,
                    message: config[i].message,
                    position: config[i].position || 'right',
                    video: config[i].video,
                    color: config[i].color,
                    fontColor: config[i].fontColor,
                    ref: document.querySelector(config[i].ref) || step.ref
                })
            }
        }
    }

    function sortByStep(a, b) {
        return a.step - b.step
    }

    function createStep() {
        createBox();
        createResource();
        createContent();
        createActions();
        setPosition();
    }

    function createBox() {
        box = document.createElement('div');
        box.classList.add('tour-box');
        box.style.backgroundColor = steps[currStep].color || '';

        document.body.appendChild(box);

        createCloseButton();
    }

    function createCloseButton() {
        btnClose = document.createElement('button');
        btnClose.classList.add('tour-close');
        btnClose.textContent = 'X';

        box.appendChild(btnClose);

        btnClose.addEventListener('mousedown', closeTour);
    }

    function createContent() {
        content = document.createElement('div');
        content.classList.add('tour-message');
        content.innerHTML = steps[currStep].message;
        content.style.color = steps[currStep].fontColor || '';

        box.appendChild(content);
    }

    function createResource() {
        if (steps[currStep].video || steps[currStep].image) {

            resource = document.createElement('div');
            resource.classList.add('tour-resource');

            box.appendChild(resource);

            createImage();
            createVideo();
        }
    }

    function createVideo() {
        var video = steps[currStep].video;

        if (video) {

            var elemVideo = document.createElement('video');
            elemVideo.src = video;
            elemVideo.autoplay = true;

            resource.appendChild(elemVideo);
        }
    }

    function createImage() {

        var image = steps[currStep].image;

        if (image) {

            var elemImage = document.createElement('img');
            elemImage.src = image;

            resource.appendChild(elemImage);
        }
    }

    function createActions() {
        var action = document.createElement('div');
        action.classList.add('tour-action');
        box.appendChild(action);

        createButtons(action);
    }

    function createButtons(_action) {
        var btnBack = document.createElement('button');
        btnBack.textContent = 'Voltar';
        _action.appendChild(btnBack);

        if (currStep === 0) {
            btnBack.disabled = true;
        }

        btnBack.addEventListener('mousedown', backStep);

        var btnNext = document.createElement('button');
        btnNext.textContent = 'Avançar';
        _action.appendChild(btnNext);

        if (currStep === steps.length - 1) {
            btnNext.disabled = true;
        }

        btnNext.addEventListener('mousedown', nextStep);
    }

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.classList.add('tour-overlay');

        document.body.insertBefore(overlay, document.body.firstChild);
    }

    function removeOverlay() {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    function setPosition() {

        var ref = steps[currStep].ref;
        var top = 0;
        var left = 0;
        var offset = 10;

        if (ref.style.position !== 'absolute') {
            ref.style.position = 'relative';
        }

        if (steps[currStep].position === 'right') {

            left = (ref.offsetLeft + ref.offsetWidth + offset);
            top = ref.offsetTop;

        } else if (steps[currStep].position === 'left') {

            left = (ref.offsetLeft - box.offsetWidth - offset);
            top = ref.offsetTop;

        } else if (steps[currStep].position === 'top') {

            left = ref.offsetLeft;
            top = ref.offsetTop - (box.offsetHeight + offset);

        } else if (steps[currStep].position === 'bottom') {

            left = ref.offsetLeft;
            top = ref.offsetTop + ref.offsetHeight + offset;
        }

        box.style.left = left + 'px';
        box.style.top = top + 'px';

        box.style.zIndex = 991;
        ref.style.zIndex = 991;

        document.body.scrollTop = ref.offsetTop;
    }

    function removeStep() {
        if (steps[currStep].ref.style.position !== 'absolute') {
            steps[currStep].ref.style.position = 'initial';
        }

        steps[currStep].ref.style.zIndex = '';

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
        if (currStep < steps.length - 1) {
            removeStep();

            currStep++;
            createStep();
        }
    }

    function closeTour() {
        removeStep();
        removeOverlay();
        steps = [];
        currStep = 0;
    }

    return {
        init: init,
        next: nextStep(),
        back: backStep()
    }
})();