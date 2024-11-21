import { GainNode } from 'node-web-audio-api';

export default class SubGraphHost {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.input = new GainNode(this.audioContext);
    this.output = new GainNode(this.audioContext);
    this.output.gain.value = 0;

    this.cleanup = null;
  }

  connect(destination) {
    this.output.connect(destination);
  }

  disconnect() {
    this.input.disconnect();
    this.output.disconnect();

    if (this.cleanup) {
      this.cleanup();
    }
  }

  fadeIn(duration) {
    this.output.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + duration);
  }

  fadeOut(duration) {
    this.output.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
  }

  exec(buildGraph, cleanup) {
    buildGraph(this.audioContext, this.input, this.output);
    this.cleanup = cleanup;
  }
}
