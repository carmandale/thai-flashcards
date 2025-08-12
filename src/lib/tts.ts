import { ensureAudioUnlocked } from './audioUnlock';

let voicesCache: SpeechSynthesisVoice[] | null = null;
let voicesLoaded = false;

function loadVoicesOnce(): Promise<SpeechSynthesisVoice[]> {
  if (voicesCache && voicesCache.length) return Promise.resolve(voicesCache);
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const tryLoad = () => {
      const v = synth.getVoices();
      if (v && v.length) {
        voicesCache = v;
        voicesLoaded = true;
        resolve(v);
        return true;
      }
      return false;
    };
    if (!tryLoad()) {
      const onChange = () => {
        if (tryLoad()) synth.onvoiceschanged = null;
      };
      synth.onvoiceschanged = onChange;
      // Fallback polling (iOS sometimes never fires)
      let attempts = 0;
      const id = window.setInterval(() => {
        attempts++;
        if (tryLoad() || attempts > 10) window.clearInterval(id);
      }, 250);
    }
  });
}

function pickThaiVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const byExact = voices.find((v) => v.lang?.toLowerCase() === 'th-th');
  if (byExact) return byExact;
  const byLang = voices.find((v) => v.lang?.toLowerCase().startsWith('th'));
  if (byLang) return byLang;
  return voices[0] || null;
}

function iosResumeWorkaround() {
  // iOS Safari can start paused; nudging resume in a short interval helps
  const synth = window.speechSynthesis;
  const id = window.setInterval(() => {
    try { synth.resume(); } catch {}
    if (!synth.paused) window.clearInterval(id);
  }, 150);
  window.setTimeout(() => window.clearInterval(id), 2000);
}

export function speakThai(text: string, rate = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  
  // Ensure audio is unlocked on mobile (critical for iOS)
  ensureAudioUnlocked();
  
  const synth = window.speechSynthesis;
  iosResumeWorkaround();
  // Attempt immediate speak using currently available voices to preserve user gesture
  const immediate = synth.getVoices();
  const immediateVoice = pickThaiVoice(immediate);
  try { synth.cancel(); } catch {}
  const utter = new SpeechSynthesisUtterance(text);
  if (immediateVoice) utter.voice = immediateVoice;
  utter.lang = immediateVoice?.lang || 'th-TH';
  utter.rate = rate;
  utter.volume = 1;
  let started = false;
  utter.onstart = () => { started = true; };
  synth.speak(utter);
  // If iOS ignored the first speak because voices weren't ready, retry shortly with loaded voices
  setTimeout(() => {
    if (started) return;
    loadVoicesOnce().then((v) => {
      const voice = pickThaiVoice(v);
      try { synth.cancel(); } catch {}
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.lang = voice?.lang || 'th-TH';
      u.rate = rate;
      u.volume = 1;
      synth.speak(u);
    }).catch(() => {});
  }, 350);
}

export function isTTSSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}


