// Web Audio API Industrial Siren & Notification Synthesizer
class IndustrialAudioService {
  constructor() {
    this.audioCtx = null;
    this.sirenOscillator1 = null;
    this.sirenOscillator2 = null;
    this.sirenGain = null;
    this.lfoOsc = null;
    this.lfoGain = null;
    this.isPlaying = false;
    this.isMuted = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.isMuted && this.isPlaying) {
      this.stopAlarm();
    }
  }

  startAlarm() {
    if (this.isMuted) return;
    if (this.isPlaying) return;

    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Master gain node
      this.sirenGain = this.audioCtx.createGain();
      this.sirenGain.gain.setValueAtTime(0.2, now);
      this.sirenGain.connect(this.audioCtx.destination);

      // Dual tone carrier oscillators (classic European/industrial dual-tone siren)
      this.sirenOscillator1 = this.audioCtx.createOscillator();
      this.sirenOscillator2 = this.audioCtx.createOscillator();

      this.sirenOscillator1.type = 'sawtooth';
      this.sirenOscillator2.type = 'square';

      this.sirenOscillator1.frequency.setValueAtTime(650, now);
      this.sirenOscillator2.frequency.setValueAtTime(880, now);

      // Low Frequency Oscillator (LFO) to modulate siren pitch (wail)
      this.lfoOsc = this.audioCtx.createOscillator();
      this.lfoOsc.type = 'sine';
      this.lfoOsc.frequency.setValueAtTime(1.8, now); // 1.8 Hz sweep

      this.lfoGain = this.audioCtx.createGain();
      this.lfoGain.gain.setValueAtTime(180, now); // modulation depth +/- 180Hz

      this.lfoOsc.connect(this.lfoGain);
      this.lfoGain.connect(this.sirenOscillator1.frequency);
      this.lfoGain.connect(this.sirenOscillator2.frequency);

      this.sirenOscillator1.connect(this.sirenGain);
      this.sirenOscillator2.connect(this.sirenGain);

      this.sirenOscillator1.start(now);
      this.sirenOscillator2.start(now);
      this.lfoOsc.start(now);

      this.isPlaying = true;
    } catch (err) {
      console.warn('Audio API init error:', err);
    }
  }

  stopAlarm() {
    if (!this.isPlaying) return;
    try {
      const now = this.audioCtx ? this.audioCtx.currentTime : 0;
      if (this.sirenGain && this.audioCtx) {
        this.sirenGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      }
      setTimeout(() => {
        try {
          if (this.sirenOscillator1) {
            this.sirenOscillator1.stop();
            this.sirenOscillator1.disconnect();
          }
          if (this.sirenOscillator2) {
            this.sirenOscillator2.stop();
            this.sirenOscillator2.disconnect();
          }
          if (this.lfoOsc) {
            this.lfoOsc.stop();
            this.lfoOsc.disconnect();
          }
          if (this.lfoGain) this.lfoGain.disconnect();
          if (this.sirenGain) this.sirenGain.disconnect();
        } catch (_) {}
        this.sirenOscillator1 = null;
        this.sirenOscillator2 = null;
        this.lfoOsc = null;
        this.lfoGain = null;
        this.sirenGain = null;
        this.isPlaying = false;
      }, 120);
    } catch (e) {
      this.isPlaying = false;
    }
  }

  playBeep(freq = 440, type = 'sine', duration = 0.15) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (_) {}
  }

  playSuccessChime() {
    this.playBeep(523.25, 'triangle', 0.1);
    setTimeout(() => this.playBeep(659.25, 'triangle', 0.1), 100);
    setTimeout(() => this.playBeep(783.99, 'triangle', 0.2), 200);
  }

  playWarningBeep() {
    this.playBeep(480, 'square', 0.2);
    setTimeout(() => this.playBeep(480, 'square', 0.2), 250);
  }
}

export const audioService = new IndustrialAudioService();
