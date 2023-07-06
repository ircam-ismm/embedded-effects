import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import { loadConfig } from '../../utils/load-config.js';
import createLayout from './layout.js';

import pluginScripting from '@soundworks/plugin-scripting/client.js';

import { AudioContext, GainNode, OscillatorNode, mediaDevices, MediaStreamAudioSourceNode, AnalyserNode } from 'node-web-audio-api';

globalThis.AudioContext = AudioContext;
globalThis.GainNode = GainNode;
globalThis.mediaDevices = mediaDevices;
globalThis.MediaStreamAudioSourceNode = MediaStreamAudioSourceNode;
globalThis.AnalyserNode = AnalyserNode;


// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

const audioContext = new AudioContext();

const analysisBufferSize = 1024;
const analysisBufferDry = new Float32Array(analysisBufferSize);
const analysisBufferWet = new Float32Array(analysisBufferSize);

class ProcessNode {
  constructor() {
    this.input = new GainNode(audioContext);
    this.output = new GainNode(audioContext);
    this.gain = this.output.gain;
    this.output.gain.value = 0;
  }
  
  connectIn(source) {
    source.connect(this.input);
  }

  connectOut(destination) {
    this.output.connect(destination);
  }

  fadein(duration) {
    const now = audioContext.currentTime;
    this.output.gain.linearRampToValueAtTime(1, now + duration);
  }

  fadeout(duration) {
    const now = audioContext.currentTime;
    this.output.gain.linearRampToValueAtTime(0, now + duration);
  }

  disconnect() {
    this.input.disconnect();
    this.output.disconnect();
  }

  process(func) {
    func(audioContext, this.input, this.output);
  }
}

//cf https://signalsmith-audio.co.uk/writing/2021/cheap-energy-crossfade/#cross-fading-curves-amplitude-preserving-cross-fade
function crossfadeCurves() {
  const steps = 50;
  const curveIn = new Float32Array(steps);
  const curveOut = new Float32Array(steps);
  for (let s = 0; s < steps; s++) {
    const t = s/steps;
    const val = t*t*t*(3-2*t);
    curveIn[s] = val;
    curveOut[s] = 1-curveIn[s];
  }
  return [curveIn, curveOut];
}

async function bootstrap() {
  /**
   * Load configuration from config files and create the soundworks client
   */
  const config = loadConfig(process.env.ENV, import.meta.url);
  const client = new Client(config);

  /**
   * Register some soundworks plugins, you will need to install the plugins
   * before hand (run `npx soundworks` for help)
   */
  // client.pluginManager.register('my-plugin', plugin);
  client.pluginManager.register('scripting', pluginScripting);

  /**
   * Register the soundworks client into the launcher
   *
   * Automatically restarts the process when the socket closes or when an
   * uncaught error occurs in the program.
   */
  launcher.register(client);

  /**
   * Launch application
   */
  await client.start();

  // create application layout (which mimics the client-side API)
  const $layout = createLayout(client);

  // ...and do your own stuff!
  const microphoneStream = await mediaDevices.getUserMedia({ audio: true });
  const streamSource = new MediaStreamAudioSourceNode(audioContext, {
    mediaStream: microphoneStream,
  });

  const inputGain = new GainNode(audioContext);

  const analyzerDry = new AnalyserNode(audioContext);
  const analyzerWet = new AnalyserNode(audioContext);
  const fadeTime = 0.02;
  const [curveIn, curveOut] = crossfadeCurves();
  let activeNodes = new Set();
  
  streamSource.connect(inputGain);
  inputGain.connect(analyzerDry);

  const synthScripting = await client.pluginManager.get('scripting');
  const thingState = await client.stateManager.create('thing');
  let controllerState;
  let unsubscribeScript;

  inputGain.gain.value = thingState.get('inputGain');

  thingState.onUpdate(async updates => {
    if ('inputGain' in updates) {
      const now = audioContext.currentTime;
      inputGain.gain.linearRampToValueAtTime(updates.inputGain, now + 0.05);
    }
    if ('monitoringActive' in updates && updates.monitoringActive) {
      getVizData();
    }
    if ('selectedScript' in updates) {
      if (unsubscribeScript) {
        unsubscribeScript();
      }
      if (updates.selectedScript === null) {
        const now = audioContext.currentTime;

        activeNodes.forEach(activeNode => {
          // activeNode.fadeout(fadeTime);
          activeNode.gain.setValueCurveAtTime(curveOut, now, fadeTime);
          setTimeout(() => {
            activeNode.disconnect();
            activeNodes.delete(activeNode);
          }, fadeTime * 1000);
        });
      } else {
        const script = await synthScripting.attach(updates.selectedScript);
        // console.log(script._state.getValues());
  
        unsubscribeScript = script.onUpdate(async () => {
          const scriptImport = await script.import();
          const processFunc = scriptImport.process;
          const now = audioContext.currentTime;
  
          activeNodes.forEach(activeNode => {
            // activeNode.fadeout(fadeTime);
            activeNode.gain.setValueCurveAtTime(curveOut, now, fadeTime);
            setTimeout(() => {
              activeNode.disconnect();
              activeNodes.delete(activeNode);
            }, fadeTime * 1000);
          });
          const processNode = new ProcessNode();
          processNode.connectIn(inputGain);
          processNode.connectOut(audioContext.destination);
          processNode.connectOut(analyzerWet);
          processNode.process(processFunc);
          processNode.gain.setValueCurveAtTime(curveIn, now, fadeTime);
          activeNodes.add(processNode);
        }, true);
      }
    }
  }, true);

  // client.stateManager.observe(async (stateName, stateId) => {
  //   if (stateName === 'controller') {
  //     controllerState = await client.stateManager.attach(stateName, stateId);

  //     // controllerState.onUpdate(async updates => {
  //     // }, true);
  //   }
  // });

  const getVizData = () => {
    if (thingState.get('monitoringActive')) {
      analyzerDry.getFloatTimeDomainData(analysisBufferDry);
      analyzerWet.getFloatTimeDomainData(analysisBufferWet);
      const now = audioContext.currentTime;
      let minD = 1;
      let maxD = -1;
      let minW = 1;
      let maxW = -1;
  
      for (let j = 0; j < analysisBufferSize; j++) {
        const valD = analysisBufferDry[j];
        minD = Math.min(minD, valD);
        maxD = Math.max(maxD, valD);
  
        const valW = analysisBufferWet[j];
        minW = Math.min(minW, valW);
        maxW = Math.max(maxW, valW);
      }
      thingState.set({
        vizDataDry: {
          time: now,
          min: minD,
          max: maxD
        },
        vizDataWet: {
          time: now, 
          min: minW,
          max: maxW
        }
      });
      const deltaT = analysisBufferSize / audioContext.sampleRate * 1000;
      setTimeout(getVizData, deltaT);
    }
  }
}


// The launcher allows to fork multiple clients in the same terminal window
// by defining the `EMULATE` env process variable
// e.g. `EMULATE=10 npm run watch-process thing` to run 10 clients side-by-side
launcher.execute(bootstrap, {
  numClients: process.env.EMULATE ? parseInt(process.env.EMULATE) : 1,
  moduleURL: import.meta.url,
});
