// --------------------------------------------------------------------------
// 2. COLOR MODE & DIRECT HASH ROUTER
// --------------------------------------------------------------------------
function applyColorMode(mode) {
  const normalized = mode === 'light' ? 'light' : 'dark';
  const html = document.documentElement;
  html.setAttribute('data-mode', normalized);
  html.classList.toggle('dark', normalized === 'dark');
  html.classList.toggle('light', normalized === 'light');

  const icon = document.getElementById('colorModeIcon');
  const label = document.getElementById('colorModeLabel');
  if (icon) {
    icon.className = normalized === 'dark'
      ? 'fa-solid fa-moon text-slate-300'
      : 'fa-solid fa-sun text-amber-500';
  }
  if (label) {
    label.textContent = normalized === 'dark' ? 'Dark' : 'Light';
  }
  try {
    localStorage.setItem('simea_theme_mode', normalized);
  } catch (err) {}
}

function toggleColorMode() {
  const current = document.documentElement.getAttribute('data-mode') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyColorMode(next);
}

function normalizeRouteId(rawId) {
  const cleaned = (rawId || '').replace(/^#/, '').trim().toLowerCase();
  if (cleaned === 'project-claw' || cleaned === 'claw') return 'claw';
  if (cleaned === 'project-medpeek' || cleaned === 'medpeek') return 'medpeek';
  if (cleaned === 'about' || cleaned === 'resume' || cleaned === 'cv') return 'about';
  return 'home';
}

function navigateTo(viewId, scrollToElementId = null, updateHash = true) {
  const normalizedId = normalizeRouteId(viewId);
  closeDropdowns();
  document.querySelectorAll('.spa-view').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById('view-' + normalizedId);
  if (target) {
    target.classList.add('active');
  }

  if (updateHash) {
    const targetHash = '#' + normalizedId;
    if (window.location.hash !== targetHash) {
      try {
        history.pushState(null, '', targetHash);
      } catch (err) {
        window.location.hash = targetHash;
      }
    }
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    const navAttr = btn.getAttribute('data-nav');
    const isProjectView = (normalizedId === 'claw' || normalizedId === 'medpeek') && navAttr === 'projects';
    if (navAttr === normalizedId || isProjectView) {
      btn.classList.add('bg-white/10', 'text-white');
      btn.classList.remove('text-gray-300');
    } else {
      btn.classList.remove('bg-white/10', 'text-white');
      btn.classList.add('text-gray-300');
    }
  });

  // Stop the claw video when leaving its page so the audio doesn't keep playing
  if (normalizedId !== 'claw') {
    pauseClawVideo();
  }

  if (scrollToElementId) {
    setTimeout(() => {
      const el = document.getElementById(scrollToElementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function switchView(viewId, scrollToElementId = null) {
  navigateTo(viewId, scrollToElementId, true);
}

function filterClawSchematic(mode) {
  const r12 = document.getElementById('schemRail12v');
  const r5 = document.getElementById('schemRail5v');
  const bAll = document.getElementById('schemBtnAll');
  const b12 = document.getElementById('schemBtn12v');
  const b5 = document.getElementById('schemBtn5v');

  if (!r12 || !r5) return;
  r12.classList.toggle('schem-dim', mode === '5v');
  r5.classList.toggle('schem-dim', mode === '12v');

  if (bAll) bAll.className = mode === 'all' ? 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow' : 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
  if (b12) b12.className = mode === '12v' ? 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow' : 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
  if (b5) b5.className = mode === '5v' ? 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow' : 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
}

window.addEventListener('hashchange', () => {
  const targetView = normalizeRouteId(window.location.hash);
  navigateTo(targetView, null, false);
});

// --------------------------------------------------------------------------
// 3. NAVBAR DROPDOWN & GLOBAL SEARCH
// --------------------------------------------------------------------------
function toggleProjectsMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const menu = document.getElementById('projectsDropdownMenu');
  const trigger = document.getElementById('projectsDropdownTrigger');
  document.getElementById('searchResultsDropdown')?.classList.add('hidden');
  if (!menu) return;
  const isOpen = menu.classList.toggle('open');
  if (trigger) {
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function selectProjectFromMenu(viewId, scrollToElementId = null, e = null) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  closeDropdowns();
  navigateTo(viewId, scrollToElementId);
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('hidden');
}

function closeDropdowns() {
  const menu = document.getElementById('projectsDropdownMenu');
  const trigger = document.getElementById('projectsDropdownTrigger');
  if (menu) menu.classList.remove('open');
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  document.getElementById('searchResultsDropdown')?.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#projectsDropdownContainer') &&
      !e.target.closest('#searchContainer')) {
    closeDropdowns();
  }
});

const searchItems = [
  { title: 'Home (Simea Tech)', category: 'Page', keywords: 'home simea tech intro welcome', action: () => navigateTo('home') },
  { title: 'About Me & Bio', category: 'Bio', keywords: 'about bio portrait haiti biomedical engineering city tech cuny', action: () => navigateTo('about') },
  { title: 'Oct 2026 Full Resume & Skills', category: 'Resume', keywords: 'resume cv cs50x mit 6.036 t-mobile bambu lab raspberry pi circuit solver', action: () => navigateTo('about', 'fullResumeSection') },
  { title: 'DIY Claw & Vending Machine', category: 'Project 01', keywords: 'claw machine vending rizwan arduino mega stepper servo video', action: () => navigateTo('claw') },
  { title: 'Claw Machine Build & Test Videos', category: 'Tests', keywords: 'test video stepper load bearing tap to pay sensor demo build photo', action: () => navigateTo('claw', 'clawTestLogSection') },
  { title: 'Claw Machine Engineering Post-Mortem Log', category: 'Debug', keywords: 'post-mortem debug short circuit fuse tinkercad winch sg90', action: () => navigateTo('claw', 'clawPostMortemSection') },
  { title: 'Claw Machine 11-Item Amazon BOM', category: 'BOM', keywords: 'bom bill of materials amazon power supply servo coupler cnc shield', action: () => navigateTo('claw', 'clawBomSection') },
  { title: 'Claw Machine Arduino Mega Code', category: 'Code', keywords: 'code firmware arduino mega ino ultrasonic joystick', action: () => navigateTo('claw', 'clawCodeSection') },
  { title: 'MedPeek: AI X-Ray Reader', category: 'Project 02', keywords: 'medpeek ai x-ray mri ct gemma 4 ollama fracatlas', action: () => navigateTo('medpeek') },
  { title: 'Copy Email: simeacarlwendy@gmail.com', category: 'Contact', keywords: 'email mail contact simeacarlwendy', action: (e) => handleEmailAction(e) }
];

function handleSearchInput(query) {
  const dropdown = document.getElementById('searchResultsDropdown');
  const q = query.trim().toLowerCase();
  const matches = q === ''
    ? searchItems.slice(0, 7)
    : searchItems.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.category.toLowerCase().includes(q)
      );

  dropdown.innerHTML = '';
  if (matches.length === 0) {
    dropdown.innerHTML = `<div class="px-3.5 py-3 text-xs text-gray-400 font-mono-tech">No matching items found.</div>`;
  } else {
    matches.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-full px-3.5 py-2 text-left hover:bg-white/10 flex items-center justify-between transition-colors';
      btn.innerHTML = `
            <span class="text-xs font-medium text-white">${item.title}</span>
            <span class="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-white/10 text-gray-300">${item.category}</span>
          `;
      btn.onclick = (ev) => {
        item.action(ev);
        closeDropdowns();
        document.getElementById('globalSearchInput').value = '';
      };
      dropdown.appendChild(btn);
    });
  }
  dropdown.classList.remove('hidden');
}

window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    document.getElementById('globalSearchInput')?.focus();
  }
});

// --------------------------------------------------------------------------
// 4. DUAL-REEL CLAW MACHINE VIDEO PLAYER (STARTS PAUSED, PLAYS ON CLICK)
// --------------------------------------------------------------------------
const clawReels = {
  1: {
    title: 'Reel 1: Full Gantry & Joystick Run',
    filepath: './content/Clawmachine1.mp4',
    poster: './content/clawmachine1-poster.jpg',
    durationSec: 217,
    durationFormatted: '03:37',
    frames: [
      {
        pct: 0,
        time: '00:00',
        title: '01. Breadboard & 4-Pin Setup',
        sub: 'Mega 2560 + CNC Shield + 4 Bins',
        desc: 'Overview of the breadboard power rail, Arduino Mega + CNC shield, and 4 Brightroom 80mm snack bins.',
        badge: '01 // BREADBOARD & 4-PIN SETUP',
        telemetry: 'LCD1602: "Please Pay"',
        gx: 0.25, gy: 0.22, zDrop: 0.18, clawClosed: false, prizeType: 'none'
      },
      {
        pct: 12,
        time: '00:08',
        title: '02. Claw Open 180° & Gantry Test',
        sub: 'NEMA 17 + Helical Shaft Couplers',
        desc: 'Close-up of the T8 lead screw, brass nut block, flexible aluminum shaft coupling, and 360° winch servo.',
        badge: '02 // CLAW OPEN 180° & GANTRY TEST',
        telemetry: 'X/Y Step: Pin 3 | Dir: Pins 5 & 6',
        gx: 0.44, gy: 0.22, zDrop: 0.20, clawClosed: false, prizeType: 'none'
      },
      {
        pct: 28,
        time: '00:24',
        title: '03. Gimbal Joystick Navigation',
        sub: 'Analog A7 & A8 Thumb Control',
        desc: 'Operating the 2-potentiometer thumb joystick to traverse the X, Y, and Z lead screws over the snack bins.',
        badge: '03 // Analog Joystick Navigation',
        telemetry: 'Joystick A7/A8 Active | Z Step: Pin 4',
        gx: 0.66, gy: 0.22, zDrop: 0.22, clawClosed: false, prizeType: 'none'
      },
      {
        pct: 52,
        time: '01:28',
        title: '04. Z-Axis Winch Spooling Down',
        sub: 'Potentiometer A9 → Servo Pin 32',
        desc: 'Spooling the tether line downward so the mechanical claw descends directly over the target snack bin.',
        badge: '04 // Z-Axis Winch Descent',
        telemetry: 'Pot A9 (0→1023) | Winch Servo Pin 32',
        gx: 0.66, gy: 0.22, zDrop: 0.65, clawClosed: false, prizeType: 'ball'
      },
      {
        pct: 74,
        time: '02:04',
        title: '05. Multi-Gear Claw Grasp',
        sub: 'Pushbuttons 30/31 → Servo Pin 33',
        desc: 'Triggering the pushbutton to close the multi-gear gripper jaws (180°→0°) firmly around the target prize.',
        badge: '05 // Claw Grasp Engaged',
        telemetry: 'Pushbutton Pin 31 | Claw Closed (0°)',
        gx: 0.66, gy: 0.22, zDrop: 0.50, clawClosed: true, prizeType: 'ball'
      },
      {
        pct: 92,
        time: '03:22',
        title: '06. Return Traverse & Release',
        sub: 'Delivery to Front Chute Bin',
        desc: 'Hoisting the captured prize, traversing to the front delivery container, and opening the claw jaws.',
        badge: '06 // Prize Delivery & Release',
        telemetry: 'Pushbutton Pin 30 | Claw Open (180°)',
        gx: 0.35, gy: 0.22, zDrop: 0.42, clawClosed: false, prizeType: 'ball_drop'
      }
    ]
  },
  2: {
    title: 'Reel 2: Snickers Extraction Close-Up',
    filepath: './content/clawMachine2.mp4',
    poster: './content/clawmachine2-poster.jpg',
    durationSec: 67,
    durationFormatted: '01:07',
    frames: [
      {
        pct: 0,
        time: '00:00',
        title: '01. Claw Open 180° & Gantry Test',
        sub: 'Positioned Over Front-Left Bin',
        desc: 'Claw suspended directly above the 80mm Brightroom container packed with Snickers bars.',
        badge: '02 // CLAW OPEN 180° & GANTRY TEST',
        telemetry: 'Claw Open (180°)',
        gx: 0.36, gy: 0.22, zDrop: 0.35, clawClosed: false, prizeType: 'snickers'
      },
      {
        pct: 26,
        time: '00:16',
        title: '02. Lowering Into Snickers Stack',
        sub: 'Tether Winch Extension',
        desc: 'Lowering the open claw jaws around the top Snickers bar inside the container.',
        badge: '02 // Jaw Alignment on Snickers',
        telemetry: 'Z-Winch Lowering | Servo Pin 32',
        gx: 0.36, gy: 0.22, zDrop: 0.68, clawClosed: false, prizeType: 'snickers'
      },
      {
        pct: 55,
        time: '00:34',
        title: '03. High-Torque Servo Clamp',
        sub: 'Locking Grip on Snickers Bar',
        desc: 'Closing the geared gripper teeth tightly around the Snickers wrapper using pushbutton servo control.',
        badge: '03 // Snickers Bar Clamped',
        telemetry: 'Servo Pin 33 Torque Lock | Grip Confirmed',
        gx: 0.36, gy: 0.22, zDrop: 0.64, clawClosed: true, prizeType: 'snickers'
      },
      {
        pct: 85,
        time: '00:55',
        title: '04. Vertical Hoist & Extraction',
        sub: 'Lifting Snickers Clear of Bin',
        desc: 'Reeling the tether cable upward on the continuous rotation servo, lifting the Snickers bar cleanly.',
        badge: '04 // Vertical Hoist Complete',
        telemetry: 'Z-Winch Hoisting | Snickers Extracted',
        gx: 0.36, gy: 0.22, zDrop: 0.28, clawClosed: true, prizeType: 'snickers'
      }
    ]
  }
};

let currentReelId = 1;
let clawPlaying = false;
let clawProgress = 0;
let clawPlaybackSpeed = 1.0;

const clawVideo = document.getElementById('clawVideo');

// Keep the play/pause icons in sync with the real video
clawVideo.addEventListener('play', () => {
  clawPlaying = true;
  setClawPlayIcons();
});
clawVideo.addEventListener('pause', () => {
  clawPlaying = false;
  setClawPlayIcons();
});

function setClawPlayIcons() {
  const iconClass = clawPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  document.getElementById('clawCenterPlayIcon').className = iconClass + ' text-xl';
  document.getElementById('clawBottomPlayIcon').className = iconClass;
  document.getElementById('clawPlayOverlay').classList.toggle('opacity-0', clawPlaying);
}

function formatSeconds(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

function renderFrameStrip() {
  const reel = clawReels[currentReelId];
  const strip = document.getElementById('clawFrameStrip');
  document.getElementById('frameStripHeaderLabel').textContent =
    `REEL ${currentReelId} KEYFRAME PREVIEW (${reel.durationFormatted}) — Slide, Hover or Click Any Frame to Jump`;

  strip.innerHTML = '';
  reel.frames.forEach((f, idx) => {
    const card = document.createElement('div');
    card.className = `frame-thumb ${idx === 0 ? 'active' : ''} shrink-0 w-48 rounded-xl bg-[#131824] p-2.5 select-none flex flex-col justify-between`;
    card.onclick = () => selectClawFrame(idx);
    card.onmouseenter = () => showFramePreviewTooltip(idx);
    card.onmouseleave = () => hideFramePreviewTooltip();

    card.innerHTML = `
          <div>
            <div class="h-16 rounded-lg bg-gradient-to-br from-slate-600/25 via-slate-950 to-slate-800/30 border border-white/10 p-2 flex flex-col justify-between relative overflow-hidden">
              <div class="flex items-center justify-between text-[10px] font-mono-tech">
                <span class="px-1.5 py-0.5 rounded bg-black/70 text-slate-200">${f.time}</span>
                <span class="text-gray-400">Reel ${currentReelId}</span>
              </div>
              <div class="text-[10px] font-mono-tech text-gray-200 truncate">${f.sub}</div>
            </div>
            <div class="text-xs font-bold text-white mt-2 truncate">${f.title}</div>
            <p class="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-snug">${f.desc}</p>
          </div>
        `;
    strip.appendChild(card);
  });
}

function switchClawReel(reelId) {
  currentReelId = reelId;
  clawProgress = 0;

  const btn1 = document.getElementById('reelBtn1');
  const btn2 = document.getElementById('reelBtn2');
  if (reelId === 1) {
    btn1.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow flex items-center gap-2';
    btn2.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow flex items-center gap-2';
  } else {
    btn2.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow flex items-center gap-2';
    btn1.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow flex items-center gap-2';
  }

  // Load the real video paused on its poster frame; it only plays when clicked
  const reel = clawReels[reelId];
  clawVideo.pause();
  clawPlaying = false;
  clawVideo.poster = reel.poster;
  clawVideo.defaultPlaybackRate = clawPlaybackSpeed;
  clawVideo.src = reel.filepath;
  clawVideo.onerror = () => {
    document.getElementById('clawTelemetryText').textContent = 'Video could not load';
  };
  clawVideo.ontimeupdate = () => {
    if (clawVideo.duration) {
      clawProgress = (clawVideo.currentTime / clawVideo.duration) * 100;
      updateClawUI(clawProgress);
    }
  };

  setClawPlayIcons();
  renderFrameStrip();
  updateClawUI(0);
}

function getActiveFrameObj(pct) {
  const frames = clawReels[currentReelId].frames;
  let chosen = frames[0];
  let chosenIdx = 0;
  for (let i = 0; i < frames.length; i++) {
    if (pct >= frames[i].pct) {
      chosen = frames[i];
      chosenIdx = i;
    }
  }
  return { frame: chosen, index: chosenIdx };
}

function updateClawUI(pct) {
  const reel = clawReels[currentReelId];
  const { frame, index } = getActiveFrameObj(pct);

  document.getElementById('clawChapterBadge').textContent = frame.badge;
  document.getElementById('clawTelemetryText').textContent = frame.telemetry;
  document.getElementById('clawTimelineSlider').value = pct;

  const curSec = (pct / 100) * reel.durationSec;
  document.getElementById('clawTimecode').textContent = `${formatSeconds(curSec)} / ${reel.durationFormatted}`;

  document.querySelectorAll('#clawFrameStrip .frame-thumb').forEach((el, i) => {
    if (i === index) el.classList.add('active');
    else el.classList.remove('active');
  });
}

function selectClawFrame(frameIdx) {
  const reel = clawReels[currentReelId];
  const targetFrame = reel.frames[frameIdx];
  if (!targetFrame) return;
  clawProgress = targetFrame.pct;
  if (clawVideo.duration) clawVideo.currentTime = (clawProgress / 100) * clawVideo.duration;
  updateClawUI(clawProgress);
  showFramePreviewTooltip(frameIdx);
}

function showFramePreviewTooltip(frameIdx) {
  const reel = clawReels[currentReelId];
  const f = reel.frames[frameIdx];
  if (!f) return;
  const tip = document.getElementById('scrubberFloatingPreview');
  document.getElementById('previewTooltipTag').textContent = `REEL ${currentReelId} KEYFRAME`;
  document.getElementById('previewTooltipTime').textContent = `${f.time} / ${reel.durationFormatted}`;
  document.getElementById('previewTooltipTitle').textContent = f.title;
  document.getElementById('previewTooltipDesc').textContent = f.desc;
  tip.classList.remove('hidden');
}

function hideFramePreviewTooltip() {
  document.getElementById('scrubberFloatingPreview')?.classList.add('hidden');
}

function hoverScrubPreview(event, sliderEl) {
  const rect = sliderEl.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const { index } = getActiveFrameObj(ratio * 100);
  showFramePreviewTooltip(index);
  clearTimeout(window._scrubTipTimeout);
  window._scrubTipTimeout = setTimeout(hideFramePreviewTooltip, 1400);
}

function scrubClawVideo(val) {
  clawProgress = parseFloat(val);
  if (clawVideo.duration) clawVideo.currentTime = (clawProgress / 100) * clawVideo.duration;
  updateClawUI(clawProgress);
}

function toggleClawPlayback() {
  if (clawVideo.paused) {
    clawVideo.play().catch(() => {});
  } else {
    clawVideo.pause();
  }
}

function pauseClawVideo() {
  // Pauses the main reel and every test clip on the claw page
  document.querySelectorAll('#view-claw video').forEach(v => {
    if (!v.paused) v.pause();
  });
}

// Only one video plays at a time on the claw page
document.addEventListener('play', (e) => {
  document.querySelectorAll('#view-claw video').forEach(v => {
    if (v !== e.target && !v.paused) v.pause();
  });
}, true);

function cycleClawSpeed() {
  const speeds = [1.0, 1.5, 2.0, 0.5];
  const nextIdx = (speeds.indexOf(clawPlaybackSpeed) + 1) % speeds.length;
  clawPlaybackSpeed = speeds[nextIdx];
  document.getElementById('clawSpeedBtn').textContent = clawPlaybackSpeed.toFixed(1) + 'x';
  clawVideo.defaultPlaybackRate = clawPlaybackSpeed;
  clawVideo.playbackRate = clawPlaybackSpeed;
}

function scrollFrameStrip(delta) {
  document.getElementById('clawFrameStrip').scrollBy({ left: delta, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 5. CLAW MACHINE CODE TABS & POST-MORTEM TABS
// --------------------------------------------------------------------------
const clawCodeSnippets = {
  original: `// ============================================================================
// CARL WENDY SIMEA & RIZWAN — ORIGINAL DOCUMENTED CLAW MACHINE CODE & LOGIC
// ============================================================================
// We first start by including the proper library or else some of the components won't work
#include display
#include servo
#include steppermotor

/* We first start by declaring the pins of every single component ahead of time so the
   microcontroller knows where to take input and where to send output signal */
X step pin 3
X direction pin 5
Y step pin 3
Y direction pin 6
Z step pin 4
Z direction pin 7
Enable pin 8 // cnc shield pin mapping.

/* The joystick uses 2 potentiometer and Gimbal mechanism so the thumb joystick moves
   around and get input no matter where it goes. Except for neutral. Because its analog It used 2
   analog pin, one for x-axis and one for y-axis each connected to potentiometer */
Joystick x pin A7 // up and down moves stepper motors connected to X and Y simultaneously
Joystick Y pin A8 // left and right move third stepper motor connected to Z on cnc shield

/* The LCD1602 has 16 pin. 4 of those pins wont be used. One of the pin goes to a 10k
   potentiometer for contrast. 4 pins are used for power, two 5v and two ground.
   The remaining six will use pin 22-27. Those pins are mostly for data. */
Display pin mapped out(22,23,24,25,26,27)

/* Because we couldn't get the RFID to work properly, we went for an ultrasonic sensor that when
   it detects an object closer than 2cm it will accept it as a "payment". The idea was to get
   something closer to the RFID and mimic the new tap payment method used in real life.
   When it detects a return, it will sound a buzzer as proof and mimic the register tap sound. */
Pin 36 for trig ultrasonic
Pin 37 for echo ultrasonic
Buzzer pin 38

/* For the midterm Project, we controlled a servo motor with a potentiometer and for the Z-axis,
   we wanted to use the same. */
A9 for potentiometer.

/* To mimic arcade claw buttons we added two pushbuttons:
   1 to open claw (0-180), 2 for closing claw (180-0) */
Pin 30 pushbutton1
Pin 31 pushbutton 2
Pin 32 servo1
Pin 33 servo2

Void setup() {
  Initialize screen
  Say "Welcome to Rizwan & Carl's"
  delay(1000) // milliseconds
  Clear
  Set pin (0,0)
  "Pay First then Grab your snack"
  delay(1000) // milliseconds

  // Linking the potentiometer on pin A9 to servo motor on pin 32
  Analog read potentiometer for potentiometer controlling servo motor
  Servo.attach

  // Initialize sequence for stepper motors
  Pinmode Enable pin // for stepper motors
  Pinmode direction
  Pinmode step // each one. For x, y and z

  // Push button setup for servo on pin 33
  Push button 1 clockwise
  Push button 2 counterclockwise
  Servo attach
}

Void loop() {
  // Payment gate: only let you use the joystick, potentiometer and pushbutton after payment
  Lcd.clear
  Set cursor (0,0)
  Lcd.print "Please Pay"
  Delay (1000)

  Read ultrasonic input
  If object detected (< 2cm) go to next:
    Print "Enjoy" and unlock pins for output
  Else wait

  // Read joystick value (with neutral deadband to prevent floating-pin motor runaway)
  If joystick value == 1 (up)       -> x and y stepper motors rotate clockwise
  Else if Joystick value == -1 (down)-> x and y stepper motor rotate counter clockwise
  Else if Joystick left             -> Z stepper motor counterclockwise
  Else if Joystick right            -> Z stepper motor clockwise
  Else don't move

  // Read potentiometer (0->1023) to control vertical servo movement (0->180)
  If value is increasing (0->1023)  -> (0->180) down movement
  Else if value is decreasing       -> (180->0) up movement

  // Read pushbuttons for claw actuation
  If Push button 1 pressed          -> (0->180) open claw
  Else if Push button 2 pressed     -> (180->0) close claw
  Else don't do anything
}`,
  compiled: `// ============================================================================
// ARDUINO MEGA 2560 SKETCH (.INO) WRITTEN FROM THE ORIGINAL DESIGN LOGIC
// Uses Carl & Rizwan's pinout, ultrasonic tap-to-pay and 3-axis control
// ============================================================================
#include <LiquidCrystal.h>
#include <Servo.h>

// 1. CNC Shield & Stepper Motor Pins
const int XY_STEP_PIN = 3;   // Shared step pulse for X & Y gantry steppers
const int X_DIR_PIN   = 5;
const int Y_DIR_PIN   = 6;
const int Z_STEP_PIN  = 4;
const int Z_DIR_PIN   = 7;
const int ENABLE_PIN  = 8;

// 2. Analog Gimbal Joystick & Z-Axis Potentiometer
const int JOY_X_PIN   = A7;  // Up/Down moves X & Y simultaneously
const int JOY_Y_PIN   = A8;  // Left/Right moves Z stepper
const int Z_POT_PIN   = A9;  // Controls Z-axis winch servo on Pin 32

// 3. LCD1602 Display Pins (22-27)
LiquidCrystal lcd(22, 23, 24, 25, 26, 27);

// 4. Ultrasonic Tap-to-Pay Sensor & Register Buzzer
const int TRIG_PIN    = 36;
const int ECHO_PIN    = 37;
const int BUZZER_PIN  = 38;

// 5. Pushbuttons & Servos
const int BTN_OPEN_PIN  = 30;
const int BTN_CLOSE_PIN = 31;
const int SERVO_Z_PIN   = 32;
const int SERVO_CLAW_PIN= 33;

Servo zWinchServo;
Servo clawGripServo;
bool sessionPaid = false;

void setup() {
  pinMode(XY_STEP_PIN, OUTPUT);
  pinMode(X_DIR_PIN, OUTPUT);
  pinMode(Y_DIR_PIN, OUTPUT);
  pinMode(Z_STEP_PIN, OUTPUT);
  pinMode(Z_DIR_PIN, OUTPUT);
  pinMode(ENABLE_PIN, OUTPUT);
  digitalWrite(ENABLE_PIN, LOW);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  pinMode(BTN_OPEN_PIN, INPUT_PULLUP);
  pinMode(BTN_CLOSE_PIN, INPUT_PULLUP);

  zWinchServo.attach(SERVO_Z_PIN);
  clawGripServo.attach(SERVO_CLAW_PIN);

  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Welcome to");
  lcd.setCursor(0, 1);
  lcd.print("Rizwan & Carl's");
  delay(1000);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pay First then");
  lcd.setCursor(0, 1);
  lcd.print("Grab your snack");
  delay(1000);
}

float readUltrasonicCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 25000);
  if (duration == 0) return 999.0;
  return duration * 0.034 / 2.0;
}

void pulseStepper(int stepPin, int steps) {
  for (int i = 0; i < steps; i++) {
    digitalWrite(stepPin, HIGH);
    delayMicroseconds(800);
    digitalWrite(stepPin, LOW);
    delayMicroseconds(800);
  }
}

void loop() {
  if (!sessionPaid) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Please Pay (<2cm)");
    if (readUltrasonicCm() < 2.0) {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(180);
      digitalWrite(BUZZER_PIN, LOW);
      sessionPaid = true;
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Enjoy!");
    } else {
      delay(250);
      return;
    }
  }

  int joyX = analogRead(JOY_X_PIN);
  int joyY = analogRead(JOY_Y_PIN);

  if (joyX > 650) {
    digitalWrite(X_DIR_PIN, HIGH);
    digitalWrite(Y_DIR_PIN, HIGH);
    pulseStepper(XY_STEP_PIN, 25);
  } else if (joyX < 370) {
    digitalWrite(X_DIR_PIN, LOW);
    digitalWrite(Y_DIR_PIN, LOW);
    pulseStepper(XY_STEP_PIN, 25);
  }

  if (joyY > 650) {
    digitalWrite(Z_DIR_PIN, HIGH);
    pulseStepper(Z_STEP_PIN, 25);
  } else if (joyY < 370) {
    digitalWrite(Z_DIR_PIN, LOW);
    pulseStepper(Z_STEP_PIN, 25);
  }

  int potVal = analogRead(Z_POT_PIN);
  int zAngle = map(potVal, 0, 1023, 0, 180);
  zWinchServo.write(zAngle);

  if (digitalRead(BTN_OPEN_PIN) == LOW) {
    clawGripServo.write(180);
  } else if (digitalRead(BTN_CLOSE_PIN) == LOW) {
    clawGripServo.write(0);
  }
}`
};

let activeClawCodeKey = 'original';

function switchClawCodeTab(tabKey) {
  activeClawCodeKey = tabKey;
  document.getElementById('clawCodeDisplay').textContent = clawCodeSnippets[tabKey];
  const b1 = document.getElementById('codeTabOriginal');
  const b2 = document.getElementById('codeTabCompiled');
  if (tabKey === 'original') {
    b1.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow';
    b2.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
  } else {
    b2.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow';
    b1.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
  }
}

function copyActiveClawCode() {
  copyTextToClipboard(clawCodeSnippets[activeClawCodeKey], 'Copied Claw Machine code to clipboard');
}

function switchPostMortemTab(tabMode) {
  const techView = document.getElementById('pmViewTechnical');
  const rawView = document.getElementById('pmViewRaw');
  const btnTech = document.getElementById('pmTabTechnical');
  const btnRaw = document.getElementById('pmTabRaw');

  if (tabMode === 'technical') {
    techView.classList.remove('hidden');
    rawView.classList.add('hidden');
    btnTech.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow';
    btnRaw.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
  } else {
    rawView.classList.remove('hidden');
    techView.classList.add('hidden');
    btnRaw.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-glow';
    btnTech.className = 'px-3.5 py-2 rounded-xl text-xs font-mono-tech font-semibold btn-outline-glow';
  }
}

// --------------------------------------------------------------------------
// 6. MEDPEEK CODE VIEWER (REAL EXCERPTS FROM github.com/Carl-Simea/MedPeek)
// --------------------------------------------------------------------------
const medpeekRepoSnippets = {
  readme: `Excerpt from README.md (full file: https://github.com/Carl-Simea/MedPeek)

# 🩻 MedPeek

**Peek inside the break.** Upload a medical image, and Gemma 4 explains in plain language what it sees. MedPeek comes in two versions. The cloud version reads X-rays, MRIs and CT scans of every body part. The local version is a lightweight prototype that runs on your own computer and focuses on hand X-rays, including children's hands.

> **In honor of Hacktoberfest Hack Day Brooklyn × GDG on Campus City Tech**
> October 30, 2026 · New York City College of Technology (City Tech), 285 Jay St, Brooklyn
>
> MedPeek started at my first hackathon. The Gemma 4 workshop at Hack Day Brooklyn showed me that a capable vision model can run on an ordinary laptop, and I wanted to try it on something that matters: helping people understand their own X-rays. Thank you to Ousmane Diallo and the GDG on Campus City Tech team, Major League Hacking, and Hacktoberfest for creating the space to build it.

⚠️ **MedPeek is a learning project, not a medical device.** It can be wrong. It does not diagnose anything. Always have a doctor read your scans.

### v2-local: my own version
A single Flask app that needs no cloud and no API key. Everything, including the AI, runs on your own computer.

**Why hands only?** v2-local is a prototype. Running locally means every reference X-ray has to live in a database on your own computer, so I kept it small to save storage, with 20 normal hand X-rays. Hands were a good place to start because they have many small bones and both adult and child cases. Covering the whole body would need a much bigger reference library and more testing than one hackathon day allowed. That's the job the cloud version does.

- **Sign in** with your first name. MedPeek greets you and replies by name.
- **Chat history**, with each conversation saved to your account so you can come back to it.
- **Drag, drop or paste** up to 5 X-rays at a time.
- **Compares against a normal hand.** Gemma 4 sees a healthy reference X-ray beside yours and lists each break: the bone, where it is, the type of break, whether it is displaced, and a likely cause.
- **Spots children's hands** from open growth plates, and avoids mistaking them for breaks.
- **Starts Gemma on its own.** On launch it runs \`ollama serve\`, pulls \`gemma4\` if needed and loads the model, with a live status pill in the corner.
- A responsive design that works on phones, with light and dark modes.

**Stack:** Python · Flask · SQLite · Ollama · Gemma 4 · Bootstrap 5 · vanilla JavaScript`,
  analyzer: `# Excerpt from v2-local/services/analyzer.py
# Full source: https://github.com/Carl-Simea/MedPeek

def analyze_xray(data, user_name, note=""):
    """Analyze one upload. Returns {'kind': 'analysis' or 'text', 'text': ..., 'data': ...}."""
    if not image_size(data):
        return text_reply(f"{user_name}, I can only read X-rays saved as JPEG or PNG. Please upload it in one of those formats.")

    parts = db.supported_parts()
    if not parts:
        return text_reply(f"{user_name}, my reference database is empty. Run create_db.py first so I have normal X-rays to compare with.")

    # Compare against the first supported part (hand) unless the user's note names another one.
    part = next((p for p in parts if p in note.lower()), "hand" if "hand" in parts else parts[0])
    reference_title, reference = closest_reference(data, db.reference_images(part))
    prompt = "Image 1 is the normal reference. Image 2 is the upload. Describe image 2."
    if note:
        prompt += f" The user wrote: {note[:300]}"
    messages = [
        {"role": "system", "content": SYSTEM.format(part=part)},
        {"role": "user", "content": prompt, "images": [_b64(reference), _b64(data)]},
    ]
    try:
        result = _parse_json(chat(messages, schema=SCHEMA))
    ...

    age = result.get("age_group")
    child_path = age != "adult"
    breaks = []
    for item in result.get("breaks") or []:
        cause = _tidy(item.get("typical_cause"))
        breaks.append({
            "bone": _tidy(item.get("bone")),
            "location": _tidy(item.get("location")),
            "type": _tidy(item.get("type")),
            "displaced": item.get("displaced", "unsure"),
            # Never a cause for a child or an unsure age, whatever the model said.
            "cause": "" if child_path or not cause else cause[0].lower() + cause[1:],
        })`
};

function switchMedPeekCodeTab(key) {
  const display = document.getElementById('medpeekCodeDisplay');
  display.textContent = medpeekRepoSnippets[key];
  // README text wraps; code keeps its exact line breaks
  display.classList.toggle('whitespace-pre-wrap', key === 'readme');
  display.classList.toggle('whitespace-pre', key !== 'readme');
  const b1 = document.getElementById('mpTabReadme');
  const b2 = document.getElementById('mpTabAnalyzer');
  if (key === 'readme') {
    b1.className = 'px-3 py-1.5 rounded-xl text-xs font-mono-tech btn-medpeek';
    b2.className = 'px-3 py-1.5 rounded-xl text-xs font-mono-tech btn-outline-glow';
  } else {
    b2.className = 'px-3 py-1.5 rounded-xl text-xs font-mono-tech btn-medpeek';
    b1.className = 'px-3 py-1.5 rounded-xl text-xs font-mono-tech btn-outline-glow';
  }
}

// --------------------------------------------------------------------------
// 7. DESKTOP & MOBILE EMAIL HANDLER + CLIPBOARD TOAST
// --------------------------------------------------------------------------
function copyTextToClipboard(text, message, showGmailLink = false) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast(message, showGmailLink);
}

function copyEmail(e, showNotice = true) {
  if (e) e.stopPropagation();
  const tempInput = document.createElement('textarea');
  tempInput.value = 'simeacarlwendy@gmail.com';
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  const modalBtn = document.getElementById('modalCopyEmailBtn');
  if (modalBtn) {
    modalBtn.textContent = 'Copied ✓';
    setTimeout(() => { modalBtn.textContent = 'Copy'; }, 2000);
  }

  if (showNotice) {
    showToast('Copied simeacarlwendy@gmail.com to clipboard', true);
  }
}

function handleEmailAction(e) {
  if (e) e.stopPropagation();
  copyEmail(e, true);
  openEmailModal();
}

function openEmailModal() {
  document.getElementById('emailActionModal')?.classList.remove('hidden');
}

function closeEmailModal() {
  document.getElementById('emailActionModal')?.classList.add('hidden');
}

function openResumeModal() {
  document.getElementById('resumeModal').classList.remove('hidden');
}

function closeResumeModal() {
  document.getElementById('resumeModal').classList.add('hidden');
}

function showToast(msg, showGmailButton = false) {
  const box = document.getElementById('toastBox');
  const actionLink = document.getElementById('toastActionLink');
  document.getElementById('toastMessage').textContent = msg;

  if (actionLink) {
    if (showGmailButton) {
      actionLink.classList.remove('hidden');
    } else {
      actionLink.classList.add('hidden');
    }
  }

  box.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    box.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
  }, 4200);
}

// Initialize right away: this file loads at the end of <body>, so the page is ready.
(function initSite() {
  try {
    const savedMode = localStorage.getItem('simea_theme_mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      applyColorMode(savedMode);
    } else {
      applyColorMode('dark');
    }
  } catch (err) {
    applyColorMode('dark');
  }

  switchClawReel(1);
  switchClawCodeTab('original');
  switchMedPeekCodeTab('readme');

  if (window.location.hash) {
    navigateTo(normalizeRouteId(window.location.hash), null, false);
  }
})();
