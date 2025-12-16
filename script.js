const circle = document.querySelector('.circle')
const parts = {
    m1: document.querySelector('[data-part="m1"]'),
    m2: document.querySelector('[data-part="m2"]'),
    s1: document.querySelector('[data-part="s1"]'),
    s2: document.querySelector('[data-part="s2"]'),
}

const startBtn = document.getElementById("startbtn");
const pauseBtn = document.getElementById("pausebtn");
const resetBtn = document.getElementById("resetbtn");

let timer = null;
let isPaused = false;

function showControls(show){
    pauseBtn.hidden = !show;
    resetBtn.hidden = !show;
    startBtn.hidden = show;
}

function sanitize(el){
    el.value = el.value.replace(/\D/g, '').slice(0, 1) || '0';
}

Object.values(parts).forEach(el =>{
    el.addEventListener('input',() =>sanitize(el));
    el.addEventListener('blur',() => sanitize(el));
});

function getTotalSeconds(){
    const m = Number(parts.m1.value || 0)*10 + Number(parts.m2.value || 0);
    const s = Number(parts.s1.value || 0)*10 + Number(parts.s2.value || 0);
    return m*60 + Math.min(s,59);
}

function updateDigits(seconds){
    const mins = Math.floor(seconds/60);
    const secs = seconds % 60;
    const mm = mins.toString().padStart(2,'0');
    const ss = secs.toString().padStart(2,'0');
    parts.m1.value = mm[0];
    parts.m2.value = mm[1];
    parts.s1.value = ss[0];
    parts.s2.value = ss[1];

}



startBtn?.addEventListener('click', () => {
    const total = getTotalSeconds();
    if(total <= 0) return;

    clearInterval(timer);
    isPaused = false;
    showControls(true);

    const partsAngle = 360/total;
    let elapsed = 0;
    let remaining = total;
    circle.style.setProperty('--angle','0deg');
    updateDigits(remaining);
    
    timer = setInterval(() => {
        if(isPaused) return;
        elapsed +=1;
        remaining = Math.max(0, total - elapsed);
        updateDigits(remaining);
        const angle = Math.min(360,elapsed*partsAngle);
        circle.style.setProperty('--angle',`${angle}deg`);
        if (remaining <= 0){
            clearInterval(timer);
            showControls(false);
        } 
    }, 1000);
});

pauseBtn?.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
});

resetBtn?.addEventListener('click', () => {
    clearInterval(timer);
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    circle.style.setProperty('--angle','0deg');
    updateDigits(0);
    showControls(false);
});

