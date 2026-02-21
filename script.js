// Hikaye konsepti: Kullanıcı tıkladıktan sonra başlar (ses kilidi için)

document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('startOverlay');
    const readme = document.getElementById('readme');
    const storyContent = document.getElementById('storyContent');
    const lampUnit = document.getElementById('lampUnit');
    const lampLight = document.querySelector('.lamp-light');
    const girlieWrapper = document.getElementById('girlieWrapper');

    // Ses efektleri - tıklama sonrası çalışacak
    const lampOnSound = new Audio('sounds/lamp-on.mp3');
    const lampFlickerSound = new Audio('sounds/lamp-flicker.mp3');
    lampOnSound.volume = 0.4;
    lampFlickerSound.volume = 0.3;

    function startExperience() {
        startOverlay.classList.add('hidden');

        // Lamp: README ile aynı anda sağdan sola kayar
        const lampSlideDelay = 1200 + 2200;
        const lampSlideDuration = 2000;
        setTimeout(() => {
            if (lampUnit) lampUnit.classList.add('slid-left');
        }, lampSlideDelay);

        // Işıklandırma + açılma sesi
        const lightStartTime = lampSlideDelay + lampSlideDuration;
        setTimeout(() => lampOnSound.play().catch(() => {}), lightStartTime - 200);
        setTimeout(() => {
            if (lampLight) lampLight.classList.add('visible');
        }, lightStartTime);

        // Girlie - ışıkla aynı anda görünür
        setTimeout(() => {
            if (girlieWrapper) girlieWrapper.classList.add('visible');
        }, lightStartTime);

        // Cızırtı sesi
        const flickerInterval = 18000;
        const firstFlickerDelay = 17100;
        setTimeout(() => {
            lampFlickerSound.currentTime = 0;
            lampFlickerSound.play().catch(() => {});
            setInterval(() => {
                lampFlickerSound.currentTime = 0;
                lampFlickerSound.play().catch(() => {});
            }, flickerInterval);
        }, lightStartTime + firstFlickerDelay);

        // Readme animasyonları
        requestAnimationFrame(() => readme.classList.add('visible'));

        const riseDelay = 1200;
        setTimeout(() => readme.classList.add('risen'), riseDelay);

        const slideDelay = riseDelay + 2200;
        setTimeout(() => readme.classList.add('slid-right'), slideDelay);

        const contentDelay = slideDelay + 1800;
        setTimeout(() => storyContent.classList.add('visible'), contentDelay);
    }

    startOverlay.addEventListener('click', startExperience, { once: true });

    // Kod yazma animasyonu → bitince "Click to start"
    const startCode = document.getElementById('startCode');
    const codeLines = [
        '// ATS.check() → passed',
        '// human.eyes() → confirmed',
        ' greet()'
    ];
    const charDelay = 45;
    const lineDelay = 300;

    function runTyping() {
        if (!startCode) return;
        let lineIdx = 0;
        let charIdx = 0;

        function typeNext() {
            if (lineIdx >= codeLines.length) {
                // Yazma bitti, greet() vurgula, cursor kaldır, kısa bekle → ready
                startCode.innerHTML = '// ATS.check() → passed\n// human.eyes() → confirmed\n <span class="fn">greet()</span>';
                document.querySelector('.start-ats .cursor')?.classList.add('typed-done');
                setTimeout(() => startOverlay.classList.add('ready'), 600);
                return;
            }
            const line = codeLines[lineIdx];
            if (charIdx < line.length) {
                startCode.textContent += line[charIdx];
                charIdx++;
                setTimeout(typeNext, charDelay);
            } else {
                startCode.textContent += '\n';
                lineIdx++;
                charIdx = 0;
                setTimeout(typeNext, lineDelay);
            }
        }
        typeNext();
    }
    runTyping();

    // Girlie switching: scroll-based, triggers when section heading enters top 35% of viewport
    const sections = [
        { el: document.getElementById('part01Section'), class: 'show-girlie3' },
        { el: document.getElementById('part02Section'), class: 'show-girlie2' },
        { el: document.getElementById('part03Section'), class: 'show-girlie5' },
        { el: document.getElementById('part04Section'), class: 'show-girlie4' },
        { el: document.getElementById('decisionSection'), class: 'show-girlie6' }
    ].filter(s => s.el);

    const TRIGGER_RATIO = 0.35; // switch when section top is in top 35% of viewport
    let ticking = false;
    let activeClass = null;

    function updateGirlie() {
        const vh = window.innerHeight;
        const triggerY = vh * TRIGGER_RATIO;
        let best = null;
        let bestDist = Infinity;

        for (const { el, class: cls } of sections) {
            const rect = el.getBoundingClientRect();
            const top = rect.top;
            const bottom = rect.bottom;
            if (top <= vh && bottom >= 0) {
                const dist = Math.abs(top - triggerY);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = cls;
                }
            }
        }

        if (best && best !== activeClass && girlieWrapper) {
            girlieWrapper.classList.remove('show-girlie2', 'show-girlie3', 'show-girlie4', 'show-girlie5', 'show-girlie6');
            girlieWrapper.classList.add(best);
            activeClass = best;
        } else if (!best && activeClass && girlieWrapper) {
            girlieWrapper.classList.remove('show-girlie2', 'show-girlie3', 'show-girlie4', 'show-girlie5', 'show-girlie6');
            activeClass = null;
        }
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateGirlie);
        }
    }

    if (girlieWrapper && sections.length) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        updateGirlie();
    }

    // Magic text star animation
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const animateMagicStar = (star) => {
        star.style.setProperty('--star-left', `${rand(-10, 100)}%`);
        star.style.setProperty('--star-top', `${rand(-40, 80)}%`);
        star.style.animation = 'none';
        star.offsetHeight;
        star.style.animation = '';
    };
    const magicStars = document.getElementsByClassName('magic-star');
    let idx = 0;
    for (const star of magicStars) {
        setTimeout(() => {
            animateMagicStar(star);
            setInterval(() => animateMagicStar(star), 1000);
        }, idx++ * 333);
    }

});
