// OnlyBalds - Multi-step captcha + reveal
(function () {
    const normalize = (s) => s.trim().toLowerCase();

    const GIFS = {
        squidFail1: 'images/illuminate-typing.gif',
        squidFail2: 'images/gru-gun-point.gif',
        bugFail1: 'images/terminid.gif',
        bugFail2: 'images/on-sight.gif',
        botFail1: 'images/helldivers-automaton.gif',
        botFail2: 'images/hammer.gif',
        reveal1: 'images/helldivers.gif',
        reveal2: 'images/hamstermert.gif',
        reveal3: 'images/james-doakes.gif'
    };

    const answers = {
        step1: 'voters are the most inteligent',
        step2: 'terminids are bad',
        step3: 'binary'
    };

    const failConfigs = {
        step1: { heading: 'ILLUMINATE DETECTED', gif1: GIFS.squidFail1, gif2: GIFS.squidFail2 },
        step2: { heading: 'TERMINID DETECTED', gif1: GIFS.bugFail1, gif2: GIFS.bugFail2 },
        step3: { heading: 'AUTOMATON DETECTED', gif1: GIFS.botFail1, gif2: GIFS.botFail2 }
    };

    const $ = (id) => document.getElementById(id);
    const steps = { step1: $('step1'), step2: $('step2'), step3: $('step3') };
    const card = $('captchaCard');
    const resultBox = $('captchaResult');
    const resultHeading = $('resultHeading');
    const resultGif = $('resultGif');
    const reveal = $('reveal');
    const revealHeading = $('revealHeading');
    const revealGif = $('revealGif');
    const boobikinStage = $('boobikinStage');

    let timeoutId = null;

    function clearTimer() {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    function bump(el) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    }

    function showStep(name) {
        clearTimer();
        resultBox.hidden = true;
        Object.keys(steps).forEach((key) => { steps[key].hidden = key !== name; });
        const input = $(name + 'Input');
        input.value = '';
        input.focus();
    }

    // Show a full-screen warning screen with the text, then the gif below/after.
    function showWarningThenGif(headingEl, gifEl, heading, gifSrc, onGifShown) {
        headingEl.textContent = heading;
        headingEl.classList.remove('correct');
        headingEl.hidden = false;
        gifEl.hidden = true;
        bump(headingEl);
        timeoutId = setTimeout(() => {
            headingEl.hidden = true;
            if (gifSrc) {
                gifEl.src = gifSrc;
                gifEl.hidden = false;
                bump(gifEl);
            }
            if (onGifShown) onGifShown();
        }, 1500);
    }

    function showResult(heading, gifSrc, onGifShown) {
        Object.keys(steps).forEach((key) => { steps[key].hidden = true; });
        resultBox.hidden = false;
        showWarningThenGif(resultHeading, resultGif, heading, gifSrc, onGifShown);
    }

    function failStep(stepName) {
        const cfg = failConfigs[stepName];
        showResult(cfg.heading, cfg.gif1, () => {
            timeoutId = setTimeout(() => {
                resultGif.src = cfg.gif2;
                bump(resultGif);
                timeoutId = setTimeout(() => {
                    showStep('step1');
                }, 2200);
            }, 2200);
        });
    }

    function correctStep(next) {
        Object.keys(steps).forEach((key) => { steps[key].hidden = true; });
        resultHeading.hidden = true;
        resultGif.hidden = true;
        resultBox.hidden = false;
        timeoutId = setTimeout(() => {
            showStep(next);
        }, 700);
    }

    function checkAnswer(stepName, nextStep) {
        const input = $(stepName + 'Input');
        if (normalize(input.value) === answers[stepName]) {
            if (nextStep === 'reveal') {
                startReveal();
            } else {
                correctStep(nextStep);
            }
        } else {
            failStep(stepName);
        }
    }

    // --- Reveal sequence ---
    function startReveal() {
        card.hidden = true;
        reveal.hidden = false;
        revealGif.hidden = false;
        boobikinStage.hidden = true;
        $('obHeader').hidden = true;

        const sequence = [
            { heading: 'there are no pics here why are you here helldiver', gif: GIFS.reveal2 },
            { heading: 'why are you still here helldiver', gif: GIFS.reveal1 },
            { heading: 'why are you still here helldiver', gif: GIFS.reveal3 }
        ];

        let i = 0;
        function nextMessage() {
            if (i < sequence.length) {
                revealHeading.textContent = sequence[i].heading;
                revealHeading.hidden = false;
                bump(revealHeading);
                revealGif.src = sequence[i].gif;
                bump(revealGif);
                i++;
                timeoutId = setTimeout(nextMessage, 3000);
            } else {
                revealHeading.hidden = true;
                revealGif.hidden = true;
                $('obHeader').hidden = false;
                boobikinStage.hidden = false;
                startBoobikin();
                startRotation();
            }
        }
        nextMessage();
    }

    // --- Video repeat ---
    function startBoobikin() {
        const video = $('boobikinVideo');
        video.loop = true;
        video.volume = 1;

        function tryPlay() {
            video.muted = false;
            video.play().catch(() => {
                video.muted = true;
                video.play().catch(() => {});
            });
        }

        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play().catch(() => {});
        });

        // Autoplay with sound is blocked without a user gesture (esp. in the
        // TEMP bypass). Start muted, then unmute on the first interaction.
        tryPlay();
        const unmute = () => {
            video.muted = false;
            video.play().catch(() => {});
        };
        document.addEventListener('pointerdown', unmute, { once: true });
        document.addEventListener('keydown', unmute, { once: true });
    }

    // --- Square rotation (CSS-driven: continuous smooth ring spin) ---
    function startRotation() {
        // handled entirely by the .ring / .gif-img CSS animations
    }

    // --- Video placeholder fallback ---
    const video = $('boobikinVideo');
    const placeholder = $('videoPlaceholder');
    if (video) {
        video.addEventListener('error', () => {
            placeholder.hidden = false;
        });
        video.addEventListener('canplay', () => {
            placeholder.hidden = true;
        });
    }

    // --- Watch Now gate ---
    $('watchNowBtn').addEventListener('click', () => {
        const hero = $('obHero');
        hero.remove();
        $('obHeader').hidden = false;
        card.hidden = false;
        steps.step1.querySelector('input').focus();
    });

    // --- Wire up buttons ---
    $('step1Btn').addEventListener('click', () => checkAnswer('step1', 'step2'));
    $('step2Btn').addEventListener('click', () => checkAnswer('step2', 'step3'));
    $('step3Btn').addEventListener('click', () => checkAnswer('step3', 'reveal'));

    ['step1', 'step2', 'step3'].forEach((name) => {
        $(name + 'Input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                $(name + 'Btn').click();
            }
        });
    });

    // TEMP: skip straight to phase 5
    (function showPhase5Directly() {
        const hero = $('obHero');
        if (hero) hero.remove();
        $('obHeader').hidden = false;
        card.hidden = true;
        startReveal();
    })();
})();
