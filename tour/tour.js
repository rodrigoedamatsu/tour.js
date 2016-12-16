var tour = (function () {
    'use strict';

    var box;
    var content;
    var action;

    var overlay;
    var steps = [];
    var custom = [];
    var currStep = 0;

    function init(_custom) {

        if (_custom && Array.isArray(_custom)) {
            custom = _custom;
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
            color: _elem.getAttribute('data-color'),
            fontColor: _elem.getAttribute('data-font-color'),
            ref: _elem
        }
    }

    // TODO: OTIMIZAR
    function insertCustomConfig() {

        for (var i = 0, len = custom.length; i < len; i++) {

            var step = steps.find(function (model) {
                return model.step === custom[i].step;
            });

            if (step) {

                step.message = custom[i].message || step.message;
                step.position = custom[i].position || step.position;
                step.video = custom[i].video || step.video;
                step.ref = document.querySelector(custom[i].ref) || step.ref;
                step.color = custom[i].color || step.color;
                step.fontColor = custom[i].fontColor || step.fontColor;

            } else {

                steps.push({
                    step: custom[i].step,
                    message: custom[i].message,
                    position: custom[i].position || 'right',
                    video: custom[i].video,
                    color: custom[i].color,
                    fontColor: custom[i].fontColor,
                    ref: document.querySelector(custom[i].ref) || step.ref
                })
            }
        }
    }

    function sortByStep(a, b) {
        return a.step - b.step
    }

    function createStep() {
        createBox();
        createContent();
        createVideo();
        createActions();
        setPosition();
    }

    function createBox() {

        box = document.createElement('div');
        box.classList.add('tour-box');
        box.style.backgroundColor = steps[currStep].color || '';

        document.body.appendChild(box);
    }

    function setPosition() {

        var ref = steps[currStep].ref;
        var left = 0;
        var top = 0;
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
    }

    function createContent() {
        content = document.createElement('div');
        content.classList.add('tour-message', 'center');
        content.innerHTML = steps[currStep].message;

        content.style.color = steps[currStep].fontColor || '';


        box.appendChild(content);
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

    function removeStep() {
        if (steps[currStep].ref.style.position !== 'absolute') {
            steps[currStep].ref.style.position = 'initial';
        }

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

    function createVideo() {

        var video = steps[currStep].video;

        if (video) {

            var elemVideo = document.createElement('video');
            elemVideo.width = '100%';
            elemVideo.height = '100%';
            elemVideo.src = video;

            content.appendChild(elemVideo);
        }
    }

    function createOverlay() {

        overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = 0;
        overlay.style.bottom = 0;
        overlay.style.left = 0;
        overlay.style.right = 0;
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

        document.body.insertBefore(overlay, document.body.firstChild);
    }

    return {
        init: init
    }
})();