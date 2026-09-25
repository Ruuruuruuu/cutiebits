/**
 * Web Audio sound effects synthesizer for Cutie Bits
 * Completely client-side, zero external assets, no 404s
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled() {
    return this.soundEnabled;
  }

  // Soft cute bubble pop when clicking buttons or adding items
  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }

  // Sweet chime when order placed or logged in
  public playChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const now = this.ctx!.currentTime + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {
      // Ignore
    }
  }

  // Authentic two-tone SMS text message incoming notification
  public playSmsAlert() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const tones = [
        { freq: 880, time: 0, dur: 0.12 },    // A5
        { freq: 1174.66, time: 0.14, dur: 0.22 } // D6
      ];

      tones.forEach(t => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const now = this.ctx!.currentTime + t.time;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(t.freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + t.dur);
      });
    } catch {
      // Ignore
    }
  }

  // Cash / coin ring for payment collected
  public playCashRegister() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + i * 0.08;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundManager();
