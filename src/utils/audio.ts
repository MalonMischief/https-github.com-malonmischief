// Standalone Web Audio API ambient drone and resonance bells
class OracleAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneGain: GainNode | null = null;
  private isPlayingDrone: boolean = false;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbientDrone() {
    if (this.isMuted || this.isPlayingDrone) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      // Low soothing root note (D2 ~ 73.4 Hz)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(73.4, this.ctx.currentTime);

      // Fifth (A2 ~ 110 Hz) with gentle detune for river mist vibration
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(110.0, this.ctx.currentTime);
      this.osc2.detune.setValueAtTime(4, this.ctx.currentTime);

      // Filter for warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.osc1.connect(filter);
      this.osc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.isPlayingDrone = true;
    } catch (e) {
      console.warn('Could not start ambient drone:', e);
    }
  }

  public stopAmbientDrone() {
    if (!this.isPlayingDrone || !this.ctx || !this.droneGain) return;
    try {
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);
      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
        } catch (_) {}
        this.isPlayingDrone = false;
      }, 1600);
    } catch (_) {
      this.isPlayingDrone = false;
    }
  }

  // Pure harmonic bell sound when a rune drops or reveals
  public playRuneChime(frequency: number = 432) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // Wooden stave click sound (Tacitus Loshölzer falling on linen cloth)
  public playWoodClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // ignore
    }
  }
}

export const oracleAudio = new OracleAudioEngine();
