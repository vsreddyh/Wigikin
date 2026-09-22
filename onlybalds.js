// OnlyBalds - Multi-step captcha + reveal
(function () {
    const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.,!?;:'"]/g, '');

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
        step1: 'in the first galactic war the squids pissed themselves seeing the power of super earth and escaped from galaxy',
        step2: 'terminids are bad',
        step3: 'binary'
    };

    const stepOrder = ['step1', 'step2', 'step3'];

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
    const progressFill = $('progressFill');
    const progressDots = document.querySelectorAll('.pdot');
    const verifyStatus = $('verifyStatus');

    let timeoutId = null;
    let busy = false;
    let cleared = 0;
    let fails = 0;

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

    function updateProgress() {
        const pct = (cleared / 3) * 100;
        if (progressFill) progressFill.style.width = pct + '%';
        progressDots.forEach((dot) => {
            const n = Number(dot.dataset.dot);
            dot.classList.toggle('done', n <= cleared);
            dot.classList.toggle('active', n === cleared + 1);
            dot.textContent = n <= cleared ? '✓' : String(n);
        });
        if (verifyStatus) {
            if (cleared === 0) verifyStatus.innerHTML = 'Clearance <strong>0/3</strong> — prove your humanity, Helldiver.';
            else if (cleared < 3) verifyStatus.innerHTML = `Clearance <strong>${cleared}/3</strong> — good work, keep going.`;
        }
    }

    function showNote(stepName) {
        const note = $(stepName + 'Note');
        if (note && note.hidden) {
            note.hidden = false;
            bump(note);
        }
    }

    function hideNote(stepName) {
        const note = $(stepName + 'Note');
        if (note) note.hidden = true;
    }

    function setError(stepName, msg) {
        const err = $(stepName + 'Error');
        if (err) {
            err.classList.remove('step-success');
            err.textContent = msg;
        }
        const input = $(stepName + 'Input');
        if (input && msg) {
            input.classList.add('input-error');
            const stepEl = $(stepName);
            stepEl.classList.remove('shake');
            void stepEl.offsetWidth;
            stepEl.classList.add('shake');
        }
    }

    function setSuccess(stepName, msg) {
        const err = $(stepName + 'Error');
        if (err) {
            err.classList.add('step-success');
            err.textContent = msg;
        }
        const input = $(stepName + 'Input');
        if (input) input.classList.remove('input-error');
    }

    function clearFeedback(stepName) {
        const err = $(stepName + 'Error');
        if (err) {
            err.classList.remove('step-success');
            err.textContent = '';
        }
        hideNote(stepName);
        const input = $(stepName + 'Input');
        if (input) input.classList.remove('input-error');
    }

    function showStep(name) {
        clearTimer();
        busy = false;
        resultBox.hidden = true;
        Object.keys(steps).forEach((key) => { steps[key].hidden = key !== name; });
        updateProgress();
        const stepEl = $(name);
        if (stepEl) bump(stepEl);
        const input = $(name + 'Input');
        clearFeedback(name);
        input.value = '';
        // focus after paint so mobile keyboards behave
        setTimeout(() => input.focus(), 60);
    }

    // Show a full-screen warning heading, then swap to the gif.
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
        fails++;
        // Reveal the step's warning note only now — not upfront.
        showNote(stepName);
        setError(stepName, '✗ Verification failed. Showing evidence…');
        busy = true;
        // Brief beat so the user sees the error, then play the fail gifs,
        // then expel back to the shop.
        timeoutId = setTimeout(() => {
            showResult(cfg.heading, cfg.gif1, () => {
                timeoutId = setTimeout(() => {
                    resultGif.src = cfg.gif2;
                    bump(resultGif);
                    timeoutId = setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2200);
                }, 2200);
            });
        }, 900);
    }

    function correctStep(next) {
        busy = true;
        cleared = Math.max(cleared, stepOrder.indexOf(next));
        // if next is step2, cleared=1; step3 -> 2
        setSuccess(stepOrder[cleared - 1] || 'step1', '✓ Identity confirmed. Advancing…');
        updateProgress();
        timeoutId = setTimeout(() => {
            showStep(next);
        }, 850);
    }

    function checkAnswer(stepName, nextStep) {
        if (busy) return;
        const input = $(stepName + 'Input');
        if (normalize(input.value) === answers[stepName]) {
            if (nextStep === 'reveal') {
                busy = true;
                cleared = 3;
                updateProgress();
                setSuccess(stepName, '✓ Final check passed. Decrypting…');
                timeoutId = setTimeout(startReveal, 850);
            } else {
                correctStep(nextStep);
            }
        } else {
            failStep(stepName);
        }
    }

    // --- Reveal sequence ---
    function startReveal() {
        clearTimer();
        busy = false;
        card.hidden = true;
        reveal.hidden = false;
        revealGif.hidden = false;
        boobikinStage.hidden = true;
        $('obHeader').hidden = true;

        const sequence = [
            { heading: 'there are no pics here why are you here helldiver', gif: GIFS.reveal2 },
            { heading: 'why are you still here helldiver', gif: GIFS.reveal1 },
            { heading: 'why are you STILL here helldiver', gif: GIFS.reveal3 }
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

        // Autoplay with sound is blocked without a user gesture.
        // Start muted, then unmute on the first interaction.
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

    // --- Watch Now gate -> briefing middle page ---
    $('watchNowBtn').addEventListener('click', () => {
        const hero = $('obHero');
        if (hero) hero.remove();
        $('obHeader').hidden = false;
        $('briefingCard').hidden = false;
        updateProgress();
        $('continueBtn').focus();
    });

    // --- Continue -> start Q1 ---
    $('continueBtn').addEventListener('click', () => {
        $('briefingCard').hidden = true;
        card.hidden = false;
        showStep('step1');
    });

    // --- Wire up buttons ---
    $('step1Btn').addEventListener('click', () => checkAnswer('step1', 'step2'));
    $('step2Btn').addEventListener('click', () => checkAnswer('step2', 'step3'));
    $('step3Btn').addEventListener('click', () => checkAnswer('step3', 'reveal'));

    ['step1', 'step2', 'step3'].forEach((name) => {
        const input = $(name + 'Input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                $(name + 'Btn').click();
            }
        });
        input.addEventListener('input', () => {
            input.classList.remove('input-error');
        });
        // All captcha inputs must be typed manually — block paste/drop.
        input.addEventListener('paste', (e) => e.preventDefault());
        input.addEventListener('drop', (e) => e.preventDefault());
    });

    // --- Prompt text is uncopyable: block copy / cut / selection grabbing ---
    document.querySelectorAll('.captcha-prompt.no-select').forEach((el) => {
        el.setAttribute('unselectable', 'on');
        el.setAttribute('aria-hidden', 'true');
        el.addEventListener('copy', (e) => e.preventDefault());
        el.addEventListener('cut', (e) => e.preventDefault());
        el.addEventListener('contextmenu', (e) => e.preventDefault());
        el.addEventListener('selectstart', (e) => e.preventDefault());
        el.addEventListener('mousedown', (e) => { if (window.getSelection) window.getSelection().removeAllRanges(); });
    });
})();
