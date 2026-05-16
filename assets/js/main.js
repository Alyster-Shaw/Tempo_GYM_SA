/*
  Main JavaScript for the gym website.
  Handles mobile navigation, reveal animations, contact validation, and the
  gallery lightbox without external libraries.
*/
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    const revealItems = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));

    const scrollSyncSections = document.querySelectorAll('.scroll-sync-section');

    if (scrollSyncSections.length > 0) {
        let ticking = false;

        function updateScrollSyncSections() {
            scrollSyncSections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                const progress = 1 - ((rect.bottom - viewportHeight * 0.18) / (rect.height + viewportHeight * 0.64));
                const clampedProgress = Math.min(Math.max(progress, 0), 1);

                section.style.setProperty('--scroll-progress', clampedProgress.toFixed(3));
                section.classList.toggle('is-scroll-complete', clampedProgress > 0.82);
            });

            ticking = false;
        }

        function requestScrollSyncUpdate() {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollSyncSections);
                ticking = true;
            }
        }

        updateScrollSyncSections();
        window.addEventListener('scroll', requestScrollSyncUpdate, { passive: true });
        window.addEventListener('resize', requestScrollSyncUpdate);
    }

    const heroSlides = document.querySelectorAll('.hero-slider__slide');
    const heroTexts = document.querySelectorAll('.hero-slider__text');
    const heroContent = document.querySelector('.hero__content');

    if (heroSlides.length > 1 && heroTexts.length > 1) {
        let currentHeroSlide = 0;

        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('is-active');
            heroTexts[currentHeroSlide].classList.remove('is-active');

            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;

            heroSlides[currentHeroSlide].classList.add('is-active');
            heroTexts[currentHeroSlide].classList.add('is-active');

            if (heroContent) {
                heroContent.classList.add('is-switching');
                setTimeout(() => heroContent.classList.remove('is-switching'), 700);
            }
        }, 5000);
    }

    const googleReviewTrack = document.querySelector('.google-reviews__track');
    const googleReviews = document.querySelectorAll('.google-review');
    const googleReviewButtons = document.querySelectorAll('[data-review-direction]');

    if (googleReviewTrack && googleReviews.length > 1) {
        let currentGoogleReview = 0;

        function showGoogleReview(index) {
            currentGoogleReview = (index + googleReviews.length) % googleReviews.length;
            googleReviewTrack.style.transform = `translateX(-${currentGoogleReview * 100}%)`;
        }

        googleReviewButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const direction = button.dataset.reviewDirection === 'prev' ? -1 : 1;
                showGoogleReview(currentGoogleReview + direction);
            });
        });

        setInterval(() => showGoogleReview(currentGoogleReview + 1), 5000);
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            const fields = {
                name: contactForm.querySelector('#name'),
                email: contactForm.querySelector('#email'),
                message: contactForm.querySelector('#message'),
            };
            let isValid = true;

            Object.values(fields).forEach((field) => {
                const wrapper = field.closest('.form-field');
                wrapper.classList.remove('is-invalid');
                wrapper.querySelector('small').textContent = '';
            });

            if (fields.name.value.trim().length < 2) {
                showError(fields.name, 'Please enter your full name.');
                isValid = false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
                showError(fields.email, 'Please enter a valid email address.');
                isValid = false;
            }

            if (fields.message.value.trim().length < 10) {
                showError(fields.message, 'Please enter a message of at least 10 characters.');
                isValid = false;
            }

            if (!isValid) {
                event.preventDefault();
            }
        });
    }

    function showError(field, message) {
        const wrapper = field.closest('.form-field');
        wrapper.classList.add('is-invalid');
        wrapper.querySelector('small').textContent = message;
    }

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (item.classList.contains('is-open')) {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        }

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            faqItems.forEach((faqItem) => {
                faqItem.classList.remove('is-open');
                faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                faqItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    const lightbox = document.querySelector('#lightbox');
    const lightboxImage = document.querySelector('.lightbox__image');
    const lightboxTitle = document.querySelector('.lightbox__title');
    const closeLightbox = document.querySelector('.lightbox__close');

    document.querySelectorAll('.gallery-card__button').forEach((button) => {
        button.addEventListener('click', () => {
            const image = button.querySelector('img');
            const title = button.closest('.gallery-card').dataset.lightboxTitle;

            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxTitle.textContent = title;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeGalleryPreview() {
        if (!lightbox) {
            return;
        }

        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        document.body.style.overflow = '';
    }

    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeGalleryPreview);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeGalleryPreview();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
                closeGalleryPreview();
            }
        });
    }
});
