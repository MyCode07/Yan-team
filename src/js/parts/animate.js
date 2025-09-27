import { gsap } from 'gsap'

class TextAnimator {
    constructor() {
        this.animatedElements = new Map();
        this.observer = null;
    }

    initialize() {
        this.prepareAllTextElements();
        this.setupIntersectionObserver();
        this.setupHoverHandlers();
    }

    // Подготовка всех текстовых элементов
    prepareAllTextElements() {
        const textElements = document.querySelectorAll('[data-animate-text]');

        if (!textElements.length) return

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
const textAnimator = new TextAnimator();
textAnimator.initialize();


// border animation
const sections = document.querySelectorAll(".border-top, .border-bottom");
if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
}


// ttile line animation
const animTitleElems = document.querySelectorAll('.anim-title-line');
if (animTitleElems.length) {

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
        lineDelay: 0.15,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lines = entry.target.closest('h1, h2, h3').querySelectorAll('.anim-title-line');

                lines.forEach((line, lineIndex) => {
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

    animTitleElems.forEach((el, index) => {
        el.style.opacity = '1';
        el.style.transform = 'none';

        gsap.set(el, {
            y: ANIM_CONFIG.start.y,
            rotationX: ANIM_CONFIG.start.rotationX,
            opacity: ANIM_CONFIG.start.opacity
        });

        observer.observe(el);
    });
}



// footer bg aniamtion
const bg = document.querySelector(".gradient-bg");
if (bg) {
    gsap.to(bg, {
        duration: 20,
        backgroundPosition: "100% 100%",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });

    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;

        gsap.to(bg, {
            duration: 1.5,
            backgroundPosition: `${x}% ${y}%`,
            ease: "power3.out"
        });
    });
}


// Создание таймлайна для сложных анимаций
const tl = gsap.timeline();

const items = [
    ...document.querySelectorAll('.header__body ul li'),
    ...document.querySelectorAll('.hero h1 span'),
    ...document.querySelectorAll('.hero__portfolio a'),
    ...document.querySelectorAll('.hero ._small-uppercase'),
    document.querySelector('.hero ._btn'),
]

if (document.querySelector('.hero .img')) {
    tl.to('.hero .img', {
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
    })
        .to('.hero .img', {
            delay: 0.4,
            y: 0,
            duration: 0.75,
            ease: "power3.out"
        })
        .to(items, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.75,
            ease: "power3.out"
        })
}
else {
    tl.to(items, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.75,
        ease: "power3.out"
    })
}