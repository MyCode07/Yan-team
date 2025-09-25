
import { gsap } from 'gsap'

// начало анимации текстов
class TextAnimator {
    constructor() {
        this.animatedElements = new Map();
        this.observer = null;
    }

    // Инициализация
    initialize() {
        this.prepareAllTextElements();
        this.setupIntersectionObserver();
        this.setupHoverHandlers();
    }

    // Подготовка всех текстовых элементов
    prepareAllTextElements() {
        const textElements = document.querySelectorAll('[data-animate-text]');

        textElements.forEach((element, index) => {
            const originalText = element.textContent;
            element.textContent = '';
            element.dataset.originalText = originalText;
            element.dataset.animationId = `text-${index}`;

            this.prepareTextElement(element, originalText);
            this.animatedElements.set(element, false);
        });
    }

    // Подготовка отдельного элемента
    prepareTextElement(element, text) {
        text = text.replace(/\s+/g, ' ');

        const words = text.split(' ');

        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';

            word.split('').forEach(letter => {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'letter';
                letterSpan.textContent = letter;
                letterSpan.style.opacity = '0';
                letterSpan.style.display = 'inline-block';
                wordSpan.appendChild(letterSpan);
            });

            wordSpan.insertAdjacentHTML('beforeend', '<span class="letter">&nbsp</span>');

            element.appendChild(wordSpan);

            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
    }

    // Настройка Intersection Observer
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const hasAnimated = this.animatedElements.get(element);

                    if (!hasAnimated) {
                        this.animateElement(element);
                        this.animatedElements.set(element, true);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '50px'
        });

        // Наблюдаем за всеми элементами
        this.animatedElements.forEach((_, element) => {
            this.observer.observe(element);
        });
    }

    // Анимация конкретного элемента
    animateElement(element) {
        const words = element.querySelectorAll('.word');
        const tl = gsap.timeline();

        words.forEach((word, wordIndex) => {
            const letters = Array.from(word.querySelectorAll('.letter'));
            const shuffledLetters = letters.sort(() => Math.random() - 0.5);

            tl.to(shuffledLetters, {
                opacity: 1,
                duration: 0.1,
                stagger: {
                    each: 0.02,
                    ease: "power2.out"
                }
            }, wordIndex * 0);
        });
    }

    // НАСТРОЙКА HOVER ТОЛЬКО ДЛЯ ССЫЛОК
    setupHoverHandlers() {
        this.animatedElements.forEach((_, element) => {
            // Проверяем, является ли элемент ссылкой (тег <a>)
            if (element.tagName === 'A') {
                element.style.cursor = 'pointer';
                element.title = 'Наведите чтобы увидеть снова';

                element.addEventListener('mouseenter', (e) => {
                    // Предотвращаем переход по ссылке при hover
                    e.preventDefault();
                    this.restartAnimation(element);
                });

                // Убираем лишние анимации масштаба, оставляем только перезапуск анимации текста
            }

            // Для остальных элементов (не ссылок) ничего не делаем
        });
    }

    // Перезапуск анимации
    restartAnimation(element) {
        const letters = element.querySelectorAll('.letter');

        // Быстро скрываем буквы
        gsap.to(letters, {
            opacity: 0,
            duration: 0.1,
            onComplete: () => {
                // Запускаем анимацию заново
                this.animateElement(element);
            }
        });
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
    const textAnimator = new TextAnimator();
    textAnimator.initialize();
});

// конец анимации текстов


// начало анимации заливки бордеров

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".border-top, .border-bottom");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
});

// конец анимации заливки бордеров

// начало анимации Заголовков

document.addEventListener('DOMContentLoaded', () => {

    const ANIM_CONFIG = {
        start: {
            y: '100%',
            rotationX: -8,
            opacity: 0
        },
        end: {
            y: 0,
            rotationX: 0,
            opacity: 1
        },
        duration: 1.2,
        ease: 'power3.out',
        lineDelay: 0.15, // задержка между строками
        threshold: 0.1
    };

    const animElements = document.querySelectorAll('.anim-title-line');

    if (typeof gsap === 'undefined') {
        animElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // Правильная установка начального состояния
    animElements.forEach((el, index) => {
        gsap.set(el, {
            y: ANIM_CONFIG.start.y,
            rotationX: ANIM_CONFIG.start.rotationX,
            opacity: ANIM_CONFIG.start.opacity
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.closest('h1, h2, h3').querySelectorAll('.anim-title-line');

                lines.forEach((line, lineIndex) => {
                    // Анимируем каждую строку с задержкой
                    gsap.to(line, {
                        y: ANIM_CONFIG.end.y,
                        rotationX: ANIM_CONFIG.end.rotationX,
                        opacity: ANIM_CONFIG.end.opacity,
                        duration: ANIM_CONFIG.duration,
                        ease: ANIM_CONFIG.ease,
                        delay: lineIndex * ANIM_CONFIG.lineDelay,
                        overwrite: 'auto'
                    });
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: ANIM_CONFIG.threshold
    });

    animElements.forEach(el => {
        observer.observe(el);
    });

});

// конец анимации Заголовков

// начало анимации Hero

document.addEventListener("DOMContentLoaded", () => {
    const tl = gsap.timeline({
        defaults: {
            ease: "power3.out",
            duration: 0.6
        }
    });

    // 1. Шапка
    tl.from("header, .header, .top-nav, .black-bar", {
        clipPath: "inset(0 100% 0 0)",
        duration: 0.7,
        stagger: 0.07
    });

    // 2. Подзаголовок
    tl.from(".hero .section__content p", {
        y: 20,
        opacity: 0
    }, "-=0.3");

    // 3. Кнопка — рост снизу вверх через scaleY
    tl.from(".hero ._btn", {
        clipPath: "inset(100% 0 0 0)",
        duration: 0.6,
        ease: "power2.out",
        transformOrigin: "bottom"
    }, "-=0.2");

    // 4. Логотип (заливка снизу вверх)
    tl.from(".hero .section__bottom img", {
        clipPath: "inset(100% 0 0 0)",
        duration: 0.6,
        ease: "power2.out"
    }, "0.2");

});

// конец анимации Hero


// начало анимации Footer

const bg = document.querySelector(".gradient-bg");

// --- Базовая бесконечная анимация ---
gsap.to(bg, {
    duration: 20,
    backgroundPosition: "100% 100%",
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
});

// --- Реакция на мышь ---
document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    gsap.to(bg, {
        duration: 1.5,
        backgroundPosition: `${x}% ${y}%`,
        ease: "power3.out"
    });
});

// конец анимации Footer
