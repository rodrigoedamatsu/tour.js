var tour = (function () {
    'use strict';

    var box;
    var overlay;
    var steps = [];
    var currStep = 0;

    function init() {
        getSteps();
        createStep();
        createOverlay();
    }

    function getSteps() {

        var elements = document.querySelectorAll('[data-step]');

        for (var i = 0, len = elements.length; i < len; i++) {
            steps.push({
                step: parseInt(elements[i].getAttribute('data-step')),
                message: elements[i].getAttribute('data-message'),
                ref: elements[i]
            });
        }

        steps.sort(function (a, b) {
            return a.step - b.step
        });
    }

    function createStep() {
        createBox();
        createMessage();
        createActions();
    }

    function createBox() {
        box = document.createElement('div');
        box.classList.add('tour-box');

        document.body.appendChild(box);

        var ref = steps[currStep].ref;
        ref.style.position = 'relative';

        box.style.left = (ref.offsetLeft + ref.offsetWidth + 10) + 'px';
        box.style.top = ref.offsetTop + 'px';
    }

    function createMessage() {
        var message = document.createElement('div');
        message.classList.add('tour-message', 'center');
        message.textContent = steps[currStep].message;

        box.appendChild(message);
    }

    function createActions() {
        var action = document.createElement('div');
        action.classList.add('tour-action', 'center');
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
        steps[currStep].ref.style.position = 'initial';
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

    function createOverlay() {

        overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = 0;
        overlay.style.bottom = 0;
        overlay.style.left = 0;
        overlay.style.right = 0;
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

        document.body.insertBefore(overlay, document.body.firstChild);
    }

    return {
        init: init
    }
})();

tour.init();