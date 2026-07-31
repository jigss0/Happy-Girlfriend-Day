(function(){
"use strict";

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* =====================================================
   LANDING PARTICLES
===================================================== */
function spawnParticle(container, className, opts){
  const el = document.createElement("div");
  el.className = className;
  const size = opts.size ? rand(opts.size[0], opts.size[1]) : null;
  if(size){ el.style.width = size+"px"; el.style.height = (opts.round ? size : size*0.75)+"px"; }
  el.style.left = rand(0,100) + "%";
  el.style.setProperty("--drift", rand(-80,80)+"px");
  el.style.animationDuration = rand(opts.dur[0], opts.dur[1]) + "s";
  el.style.animationDelay = rand(0, opts.dur[1]) + "s";
  if(opts.color) el.style.background = opts.color();
  container.appendChild(el);
  return el;
}

function initLandingParticles(){
  const petals = document.getElementById("petals-field");
  const confetti = document.getElementById("confetti-field");
  const sparkles = document.getElementById("sparkle-field");
  const petalColors = ["#f0a6c2","#ffd3e6","#e7dbf6","#f8dce6"];
  const confettiColors = ["#ff3e88","#efa3c1","#d8c3ed","#c58e93","#fff"];

  for(let i=0;i<18;i++) spawnParticle(petals, "petal", { size:[12,20], dur:[10,20] });
  for(let i=0;i<22;i++) spawnParticle(confetti, "confetto", { size:[6,10], round:false, dur:[9,17], color:()=>pick(confettiColors) });
  for(let i=0;i<26;i++){
    const s = spawnParticle(sparkles, "sparkle", { dur:[2.4,4.6] });
    s.style.top = rand(0,100)+"%";
    s.style.animationDuration = rand(2,4)+"s";
  }
  for(let i=0;i<8;i++){
    const b = document.createElement("div");
    b.className = "bokeh";
    const size = rand(60,150);
    b.style.width = size+"px"; b.style.height = size+"px";
    b.style.left = rand(0,100)+"%";
    b.style.top = rand(0,100)+"%";
    b.style.animationDuration = rand(6,12)+"s";
    sparkles.appendChild(b);
  }
}

/* =====================================================
   AMBIENT CANVAS: paper grain + drifting hearts/sparkles site-wide
===================================================== */
function initAtmosphereCanvas(){
  const canvas = document.getElementById("atmosphere-canvas");
  const ctx = canvas.getContext("2d");
  let w,h;
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 180; grainCanvas.height = 180;
  const gctx = grainCanvas.getContext("2d");
  const imgData = gctx.createImageData(180,180);
  for(let i=0;i<imgData.data.length;i+=4){
    const v = 235 + Math.random()*20;
    imgData.data[i]=v; imgData.data[i+1]=v; imgData.data[i+2]=v; imgData.data[i+3]=14;
  }
  gctx.putImageData(imgData,0,0);

  const motes = [];
  for(let i=0;i<24;i++){
    motes.push({ x: rand(0,w), y: rand(0,h), r: rand(1,2.6), vy: rand(0.06,0.18), phase: rand(0,Math.PI*2) });
  }

  function frame(t){
    ctx.clearRect(0,0,w,h);
    const pattern = ctx.createPattern(grainCanvas, "repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    motes.forEach(m=>{
      m.y -= m.vy;
      if(m.y < -10) m.y = h+10;
      const twinkle = 0.4 + 0.4*Math.sin(t/900 + m.phase);
      ctx.globalAlpha = twinkle;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* =====================================================
   POLAROID HOLD-TO-DEVELOP
===================================================== */
function initPolaroidHold(){
  const photo = document.getElementById("polaroid-photo");
  const ring = document.getElementById("hold-progress-ring");
  const flash = document.getElementById("flash-overlay");
  const hint = document.getElementById("hold-hint");
  const HOLD_MS = 1400;
  let startTime = null, raf = null, developed = false;

  function tick(now){
    if(!startTime) return;
    const elapsed = now - startTime;
    const pct = Math.min(100, (elapsed/HOLD_MS)*100);
    ring.style.setProperty("--p", pct.toFixed(1));
    if(pct >= 100){
      completeDevelop();
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function startHold(){
    if(developed) return;
    photo.classList.add("holding");
    startTime = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function cancelHold(){
    if(developed) return;
    photo.classList.remove("holding","developing");
    ring.style.setProperty("--p", 0);
    startTime = null;
    cancelAnimationFrame(raf);
  }
  function completeDevelop(){
    developed = true;
    photo.classList.remove("holding");
    photo.classList.add("developing");
    flash.classList.add("flash");
    if(hint) hint.style.opacity = "0";
    setTimeout(()=>{
      photo.classList.add("developed");
    }, 250);
    setTimeout(()=>{ flash.classList.remove("flash"); }, 600);
  }

  photo.addEventListener("pointerdown", (e)=>{ e.preventDefault(); startHold(); });
  photo.addEventListener("pointerup", cancelHold);
  photo.addEventListener("pointerleave", cancelHold);
  photo.addEventListener("pointercancel", cancelHold);
  photo.addEventListener("contextmenu", (e)=>e.preventDefault());
}

/* =====================================================
   DIARY
===================================================== */
function buildDecor(container, decorList){
  decorList.forEach(code=>{
    const [type, pos] = code.split("-");
    let el;
    const posStyle = {};
    switch(pos){
      case "tl": posStyle.top="14px"; posStyle.left="14px"; break;
      case "tr": posStyle.top="14px"; posStyle.right="14px"; break;
      case "bl": posStyle.bottom="14px"; posStyle.left="14px"; break;
      case "br": posStyle.bottom="14px"; posStyle.right="14px"; break;
    }
    if(type==="washi"){
      el = document.createElement("div");
      el.className = "washi";
      el.style.width = rand(60,90)+"px";
      el.style.transform = `rotate(${rand(-20,20)}deg)`;
    } else if(type==="paperclip"){
      el = document.createElement("div");
      el.className = "paperclip";
      el.style.transform = `rotate(${rand(-8,8)}deg)`;
    } else if(type==="coffee"){
      el = document.createElement("div");
      el.className = "coffee-stain";
      const size = rand(46,72);
      el.style.width = size+"px"; el.style.height = size+"px";
    } else if(type==="stamp"){
      el = document.createElement("div");
      el.className = "stamp";
      el.textContent = "♥ posted";
    } else if(type==="flower"){
      el = document.createElement("div");
      el.className = "pressed-flower";
      el.innerHTML = `<svg viewBox="0 0 46 46"><g fill="#d38fae" opacity="0.8">
        <circle cx="23" cy="10" r="8"/><circle cx="23" cy="36" r="8"/>
        <circle cx="10" cy="23" r="8"/><circle cx="36" cy="23" r="8"/>
        </g><circle cx="23" cy="23" r="7" fill="#e8c15f"/></svg>`;
    }
    if(el){ Object.assign(el.style, posStyle); el.style.position="absolute"; container.appendChild(el); }
  });
}

function spawnDust(container){
  for(let i=0;i<26;i++){
    const d = document.createElement("div");
    d.className = "dust-mote";
    d.style.width = d.style.height = rand(2,4)+"px";
    d.style.borderRadius = "50%";
    d.style.background = "rgba(255,240,220,0.85)";
    d.style.left = rand(0,100)+"%";
    d.style.top = rand(40,100)+"%";
    d.style.opacity = "0";
    d.animate([
      { transform:"translateY(0px)", opacity:0 },
      { transform:`translateY(-${rand(60,140)}px)`, opacity: rand(0.4,0.9), offset:0.5 },
      { transform:`translateY(-${rand(140,220)}px)`, opacity:0 }
    ], { duration: rand(1400,2400), easing:"ease-out" });
    container.appendChild(d);
    setTimeout(()=>d.remove(), 2500);
  }
}

function playPageTurnSound(audioCtx){
  if(!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.35;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){
    const decay = 1 - i/bufferSize;
    data[i] = (Math.random()*2-1) * decay * 0.35;
  }
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 900;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.5;
  src.connect(filter).connect(gain).connect(audioCtx.destination);
  src.start();
}

function initDiary(getAudioCtx){
  const closed = document.getElementById("diary-closed");
  const cover = document.querySelector(".diary-cover");
  const dustLayer = document.getElementById("dust-layer");
  const openView = document.getElementById("diary-open");
  const pageLeft = document.getElementById("diary-page-left");
  const pageRight = document.getElementById("diary-page-right");
  const prevBtn = document.getElementById("diary-prev");
  const nextBtn = document.getElementById("diary-next");
  const pageNumEl = document.getElementById("diary-page-num");
  const pageTotalEl = document.getElementById("diary-page-total");

  let current = 0;
  pageTotalEl.textContent = DIARY_PAGES.length;

  function renderPage(i){
    const p = DIARY_PAGES[i];
    pageLeft.innerHTML = `<div class="diary-quote-wrap">
        <div class="diary-page-photo" style="--tilt:${(i%2===0?-1:1) * (2+ (i%3))}deg;">
          <img src="images/${p.img}" alt="${p.title}" loading="lazy">
        </div>
        <p class="diary-quote-text">&ldquo;${p.title}&rdquo;</p>
      </div>`;
    buildDecor(pageLeft, p.decor);
    pageRight.innerHTML = `
      <h3 class="diary-page-title">${p.title}</h3>
      <p class="diary-page-text">${p.text}</p>
      <span class="diary-page-num-label">page ${i+1}</span>
    `;
    pageNumEl.textContent = i+1;
    prevBtn.disabled = i===0;
    nextBtn.disabled = i===DIARY_PAGES.length-1;
  }

  function flipTo(i){
    if(i<0 || i>=DIARY_PAGES.length || i===current) return;
    pageLeft.classList.add("flipping");
    pageRight.classList.add("flipping");
    playPageTurnSound(getAudioCtx());
    setTimeout(()=>{
      current = i;
      renderPage(current);
    }, 260);
    setTimeout(()=>{
      pageLeft.classList.remove("flipping");
      pageRight.classList.remove("flipping");
    }, 700);
  }

  prevBtn.addEventListener("click", ()=>flipTo(current-1));
  nextBtn.addEventListener("click", ()=>flipTo(current+1));

  cover.addEventListener("click", ()=>{
    spawnDust(dustLayer);
    cover.style.transition = "transform 0.9s cubic-bezier(.4,0,.2,1), filter 0.9s ease";
    cover.style.transform = "rotateY(-100deg) scale(0.9)";
    cover.style.filter = "brightness(1.3)";
    playPageTurnSound(getAudioCtx());
    setTimeout(()=>{
      closed.style.display = "none";
      openView.hidden = false;
      renderPage(0);
    }, 750);
  });
}

/* =====================================================
   GALLERY
===================================================== */
function initGallery(){
  const board = document.getElementById("gallery-board");
  GALLERY_ITEMS.forEach((item, idx)=>{
    const el = document.createElement("div");
    el.className = "gallery-item" + (item.type==="filmstrip" ? " filmstrip" : "");
    el.style.top = item.top;
    el.style.left = item.left;
    el.style.width = item.w+"px";
    el.style.transform = `rotate(${item.rot}deg)`;
    el.style.zIndex = idx;

    if(item.type === "filmstrip"){
      el.innerHTML = `
        <div style="position:relative;">
          <div class="filmstrip-holes"></div>
          <div class="filmstrip-holes right"></div>
          <div class="filmstrip-frame"><img src="images/${item.img}" alt="${item.caption}" loading="lazy"></div>
        </div>
        <p class="gallery-caption" style="color:#f3e3da;">${item.caption}</p>
      `;
    } else {
      el.innerHTML = `
        <div class="gallery-photo-art"><img src="images/${item.img}" alt="${item.caption}" loading="lazy"></div>
        <p class="gallery-caption">${item.caption}</p>
      `;
      if(idx % 3 !== 2){
        const tape = document.createElement("div");
        tape.className = "gallery-tape";
        tape.style.top = "-10px";
        tape.style.left = (item.w/2 - 35) + "px";
        tape.style.transform = `rotate(${rand(-8,8)}deg)`;
        el.appendChild(tape);
      }
    }
    board.appendChild(el);
  });
}

/* =====================================================
   ENVELOPES
===================================================== */
function initEnvelopes(){
  const shelf = document.getElementById("envelope-shelf");
  const overlay = document.createElement("div");
  overlay.className = "envelope-modal-overlay";
  overlay.innerHTML = `
    <div class="envelope-modal">
      <button class="envelope-modal-close" aria-label="Close">&times;</button>
      <h3 id="envelope-modal-title"></h3>
      <p id="envelope-modal-body"></p>
    </div>
  `;
  document.body.appendChild(overlay);
  const modalTitle = overlay.querySelector("#envelope-modal-title");
  const modalBody = overlay.querySelector("#envelope-modal-body");
  const closeBtn = overlay.querySelector(".envelope-modal-close");

  function closeModal(){ overlay.classList.remove("visible"); }
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e)=>{ if(e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeModal(); });

  ENVELOPES.forEach(env=>{
    const el = document.createElement("div");
    el.className = "envelope";
    el.setAttribute("role","button");
    el.setAttribute("tabindex","0");
    el.innerHTML = `
      <div class="envelope-flap"></div>
      <div class="wax-seal">♥</div>
      <div class="envelope-label">${env.label}</div>
    `;
    function openEnvelope(){
      if(el.classList.contains("open")) return;
      el.classList.add("open");
      setTimeout(()=>{
        modalTitle.textContent = env.title;
        modalBody.textContent = env.body;
        overlay.classList.add("visible");
      }, 500);
    }
    el.addEventListener("click", openEnvelope);
    el.addEventListener("keypress", (e)=>{ if(e.key==="Enter") openEnvelope(); });
    shelf.appendChild(el);
  });
}

/* =====================================================
   SCRATCH CARDS
===================================================== */
function initScratchCards(){
  const grid = document.getElementById("scratch-grid");

  SCRATCH_CARDS.forEach((card, idx)=>{
    const wrap = document.createElement("div");
    wrap.className = "scratch-card";
    wrap.innerHTML = `
      <div class="scratch-postcard-bg"><img src="images/${card.img}" alt="${card.title}" loading="lazy"></div>
      <div class="scratch-postcard-text">
        <h4>${card.title}</h4>
        <p>${card.text}</p>
      </div>
      <canvas class="scratch-canvas"></canvas>
      <div class="scratch-hint">scratch me</div>
    `;
    grid.appendChild(wrap);

    const canvas = wrap.querySelector(".scratch-canvas");
    const ctx = canvas.getContext("2d");

    function sizeCanvas(){
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawFoil();
    }

    function drawFoil(){
      const w = canvas.width, h = canvas.height;
      const g = ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0, "#e7e2d8");
      g.addColorStop(0.5, "#cfc7b8");
      g.addColorStop(1, "#e7e2d8");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,w,h);
      ctx.strokeStyle = "rgba(120,100,70,0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(6,6,w-12,h-12);
      ctx.font = `${Math.max(14, w*0.07)}px 'Caveat', cursive`;
      ctx.fillStyle = "rgba(90,70,50,0.55)";
      ctx.textAlign = "center";
      ctx.fillText("scratch to reveal", w/2, h/2 - 6);
      ctx.font = `${Math.max(20, w*0.11)}px serif`;
      ctx.fillText("✦", w/2, h/2 + 24);
    }

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    let scratching = false;
    let lastCheck = 0;

    function spawnScratchDust(x,y){
      const d = document.createElement("div");
      d.className = "dust-mote";
      d.style.position = "absolute";
      d.style.left = x+"px"; d.style.top = y+"px";
      d.style.width = d.style.height = rand(2,4)+"px";
      d.style.borderRadius = "50%";
      d.style.background = "#c9c2b4";
      d.style.zIndex = 7;
      wrap.appendChild(d);
      d.animate([
        { transform:"translate(0,0)", opacity:0.9 },
        { transform:`translate(${rand(-14,14)}px, ${rand(-10,-24)}px)`, opacity:0 }
      ], { duration: 500, easing:"ease-out" });
      setTimeout(()=>d.remove(), 520);
    }

    function scratchAt(clientX, clientY){
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI*2);
      ctx.fill();
      if(Math.random() < 0.4) spawnScratchDust(x,y);
    }

    function checkRevealed(){
      if(wrap.classList.contains("revealed")) return;
      const now = Date.now();
      if(now - lastCheck < 350) return;
      lastCheck = now;
      const sample = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let cleared = 0;
      const step = 4 * 37;
      let total = 0;
      for(let i=3; i<sample.length; i+=step){
        total++;
        if(sample[i] < 40) cleared++;
      }
      if(total && cleared/total > 0.45){
        wrap.classList.add("revealed");
      }
    }

    function pointerDown(e){
      scratching = true;
      scratchAt(e.clientX, e.clientY);
      canvas.setPointerCapture(e.pointerId);
    }
    function pointerMove(e){
      if(!scratching) return;
      scratchAt(e.clientX, e.clientY);
      checkRevealed();
    }
    function pointerUp(){
      scratching = false;
      checkRevealed();
    }
    canvas.addEventListener("pointerdown", pointerDown);
    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointerleave", pointerUp);
  });
}

/* =====================================================
   MUSIC — synthesized soft piano ambience via Web Audio API
===================================================== */
function initMusic(){
  const btn = document.getElementById("music-toggle");
  const label = btn.querySelector(".music-label");
  let audioCtx = null;
  let playing = false;
  let scheduleTimer = null;
  let masterGain = null;

  const chords = [
    [261.63, 329.63, 392.00],
    [293.66, 349.23, 440.00],
    [246.94, 311.13, 392.00],
    [220.00, 277.18, 349.23]
  ];
  let chordIndex = 0;

  function ensureCtx(){
    if(!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.0001;
      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.32;
      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.28;
      const delayFilter = audioCtx.createBiquadFilter();
      delayFilter.type = "lowpass";
      delayFilter.frequency.value = 1800;
      masterGain.connect(delay);
      delay.connect(delayFilter);
      delayFilter.connect(feedback);
      feedback.connect(delay);
      delay.connect(audioCtx.destination);
      masterGain.connect(audioCtx.destination);
    }
    return audioCtx;
  }

  function pluckNote(freq, time, dur, gainVal){
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gainVal, time + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  function scheduleChord(){
    const now = audioCtx.currentTime;
    const chord = chords[chordIndex % chords.length];
    chord.forEach((f, i)=>{
      pluckNote(f, now + i*0.18, 2.6, 0.07);
      pluckNote(f*2, now + i*0.18 + 0.9, 2.2, 0.03);
    });
    chordIndex++;
  }

  function play(){
    ensureCtx();
    if(audioCtx.state === "suspended") audioCtx.resume();
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.2);
    scheduleChord();
    scheduleTimer = setInterval(scheduleChord, 3200);
    playing = true;
    btn.classList.add("playing");
    label.textContent = "Our song is playing";
  }
  function pause(){
    if(audioCtx){
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    }
    clearInterval(scheduleTimer);
    playing = false;
    btn.classList.remove("playing");
    label.textContent = "Play our song";
  }

  btn.addEventListener("click", ()=>{ playing ? pause() : play(); });

  return () => audioCtx;
}

/* =====================================================
   NAV DOTS + SCROLL PROGRESS
===================================================== */
function initNavAndProgress(){
  const links = document.querySelectorAll("#chapter-nav a");
  const sections = Array.from(links).map(l=>document.querySelector(l.getAttribute("href")));
  const ribbonFill = document.getElementById("scroll-ribbon-fill");

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const idx = sections.indexOf(entry.target);
      if(entry.isIntersecting && idx>-1){
        links.forEach(l=>l.classList.remove("active"));
        links[idx].classList.add("active");
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s=>{ if(s) observer.observe(s); });

  function onScroll(){
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height>0 ? (scrollTop/height)*100 : 0;
    ribbonFill.style.width = pct + "%";
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
}

/* =====================================================
   FINAL LETTER HEARTS
===================================================== */
function initFinalHearts(){
  const container = document.getElementById("final-hearts");
  function spawn(){
    const h = document.createElement("div");
    h.className = "tiny-heart";
    h.style.left = rand(4,96)+"%";
    h.style.bottom = "-20px";
    h.style.fontSize = rand(12,22)+"px";
    h.style.color = pick(["#ff3e88","#efa3c1","#d8c3ed"]);
    h.textContent = "♥";
    h.style.position = "absolute";
    h.style.opacity = "0.85";
    container.appendChild(h);
    const dur = rand(6000,10000);
    h.animate([
      { transform:"translateY(0) translateX(0) rotate(0deg)", opacity:0 },
      { transform:`translateY(-${rand(120,220)}px) translateX(${rand(-20,20)}px) rotate(20deg)`, opacity:0.85, offset:0.5 },
      { transform:`translateY(-${rand(400,600)}px) translateX(${rand(-40,40)}px) rotate(-15deg)`, opacity:0 }
    ], { duration: dur, easing:"ease-out" });
    setTimeout(()=>h.remove(), dur+100);
  }
  setInterval(spawn, 900);
  for(let i=0;i<4;i++) setTimeout(spawn, i*400);
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", ()=>{
  initLandingParticles();
  initAtmosphereCanvas();
  initPolaroidHold();
  const getAudioCtx = initMusic();
  initDiary(getAudioCtx);
  initGallery();
  initEnvelopes();
  initScratchCards();
  initNavAndProgress();
  initFinalHearts();
});
})();
