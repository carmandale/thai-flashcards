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

export async function speakThai(text: string, rate = 0.9) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  iosResumeWorkaround();
  const voices = await loadVoicesOnce().catch(() => [] as SpeechSynthesisVoice[]);
  const voice = pickThaiVoice(voices);
  try { synth.cancel(); } catch {}
  const u = new SpeechSynthesisUtterance(text);
  if (voice) u.voice = voice;
  if (voice?.lang) u.lang = voice.lang;
  u.rate = rate;
  synth.speak(u);
}

export function isTTSSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}


