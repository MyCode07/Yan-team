import { maskInputs } from "./static/inputmask.js";

maskInputs('+7 (999) 999-99-99', '[name="phone"]')

import { animateAction, animateStaggerAction, animateSVGStaggerAction } from "./parts/animations.js";

import "./parts/animate.js";
import "./parts/forms.js";
import "./parts/popup.js";
import "./parts/menu.js";

animateStaggerAction();
animateAction();
animateSVGStaggerAction();

document.addEventListener('click', function (e) {
    let targetEl = e.target;
    if (targetEl.classList.contains('pages-close')) {
        document.querySelector('.pages').classList.toggle('_hide');
    }
})
