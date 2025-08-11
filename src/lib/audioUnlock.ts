let unlocked = false;
let audioCtx: AudioContext | null = null;

function unlockWebAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    const node = audioCtx.createBufferSource();
    node.buffer = audioCtx.createBuffer(1, 1, 22050);
    node.connect(audioCtx.destination);
    node.start(0);
  } catch {}
}

export function ensureAudioUnlocked() {
  if (unlocked) return;
  unlocked = true;
  try { window.speechSynthesis?.resume(); } catch {}
  unlockWebAudio();
  // Kick voices load once
  try { void window.speechSynthesis?.getVoices(); } catch {}
}

export function attachGlobalAudioUnlockOnce() {
  if (unlocked) return;
  const handler = () => { ensureAudioUnlocked(); cleanup(); };
  const cleanup = () => {
    window.removeEventListener('pointerdown', handler);
    window.removeEventListener('touchstart', handler);
    window.removeEventListener('click', handler);
    window.removeEventListener('keydown', handler);
  };
  window.addEventListener('pointerdown', handler, { once: true, passive: true });
  window.addEventListener('touchstart', handler, { once: true, passive: true });
  window.addEventListener('click', handler, { once: true });
  window.addEventListener('keydown', handler, { once: true });
}


