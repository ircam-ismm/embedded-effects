// installed module
import { Scheduler } from '@ircam/sc-scheduling';
// local module
import addOne from './utils/add-one.js';

let scheduler = null;

export function buildGraph(audioContext, input, output) {
  scheduler = new Scheduler(() => audioContext.currentTime);

  scheduler.add((now) => {
    const osc = audioContext.createOscillator();
    osc.connect(output);
    osc.frequency.value = 100;
    osc.start(now);
    osc.stop(now + 0.5);
    
    return addOne(now);
  });
}

export function cleanup() {
  scheduler.clear();
}