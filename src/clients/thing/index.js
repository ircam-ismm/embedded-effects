import '@soundworks/helpers/polyfills.js';
import { hostname } from 'node:os';
import { Client } from '@soundworks/core/client.js';
import { loadConfig, launcher } from '@soundworks/helpers/node.js';

import pluginScripting from '@soundworks/plugin-scripting/client.js';

import {
  AudioContext,
  GainNode,
  mediaDevices,
  MediaStreamAudioSourceNode,
  AnalyserNode,
} from 'node-web-audio-api';

import SubGraphHost from './SubGraphHost.js';

// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

async function bootstrap() {
  const config = loadConfig(process.env.ENV, import.meta.url);
  const client = new Client(config);

  client.pluginManager.register('scripting', pluginScripting);

  launcher.register(client);

  await client.start();

  const scripting = await client.pluginManager.get('scripting');
  const thing = await client.stateManager.create('thing', { id: hostname() });

  // create audio graph
  const audioContext = new AudioContext();
  // pre script graph
  const mediaStream = await mediaDevices.getUserMedia({ audio: true });
  const streamSource = new MediaStreamAudioSourceNode(audioContext, { mediaStream });
  const inputGain = new GainNode(audioContext);
  const analyserDry = new AnalyserNode(audioContext);
  streamSource.connect(inputGain)
  inputGain.connect(analyserDry);

  // post script graph
  const outputGain = new GainNode(audioContext);
  outputGain.connect(audioContext.destination);
  // this will be connected to the user defined graph output
  const analyserWet = new AnalyserNode(audioContext);

  let subGraphHost = null;

  function clearsubGraphHost() {
    if (subGraphHost === null) {
      return;
    }

    // keep old reference around until it is fully disconnected
    const prevSubGraphHost = subGraphHost;
    subGraphHost = null;

    prevSubGraphHost.fadeOut(1);
    setTimeout(() => prevSubGraphHost.disconnect(), 1000);
  }


  // for signal feedback
  const analysisBufferSize = 1024;
  const analysisBufferDry = new Float32Array(analysisBufferSize);
  const analysisBufferWet = new Float32Array(analysisBufferSize);

  function processFeedbackForSignal() {
    if (thing.get('monitoring')) {
      analyserDry.getFloatTimeDomainData(analysisBufferDry);
      analyserWet.getFloatTimeDomainData(analysisBufferWet);

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
      thing.set({
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

      const dt = analysisBufferSize / audioContext.sampleRate * 1000;
      setTimeout(processFeedbackForSignal, dt);
    }
  }

  thing.onUpdate(async updates => {
    for (let [name, value] of Object.entries(updates)) {
      switch (name) {
        case 'inputGain': {
          inputGain.gain.setTargetAtTime(value, audioContext.currentTime, 0.02);
          break;
        }
        case 'outputGain': {
          outputGain.gain.setTargetAtTime(value, audioContext.currentTime, 0.02);
          break;
        }
        case 'selectedScript': {
          clearsubGraphHost();

          if (value === null) {
            return;
          }

          const script = await scripting.attach(value);
          console.log('> running script', script);

          script.onUpdate(async () => {
            clearsubGraphHost();

            const { buildGraph, cleanup } = await script.import();

            if (!buildGraph) {
              console.error('The script does not export a `buildGraph` function, abort');
              return;
            }

            subGraphHost = new SubGraphHost(audioContext);
            subGraphHost.exec(buildGraph, cleanup);
            // connect to the rest of the graph
            inputGain.connect(subGraphHost.input);
            subGraphHost.connect(outputGain);
            subGraphHost.connect(analyserWet);
            subGraphHost.fadeIn(1);
          }, true);
        }
        case 'monitoring': {
          if (value) {
            processFeedbackForSignal();
          }
          break;
        }
      }
    }
  }, true);
}

// The launcher allows to fork multiple clients in the same terminal window
// by defining the `EMULATE` env process variable
// e.g. `EMULATE=10 npm run watch thing` to run 10 clients side-by-side
launcher.execute(bootstrap, {
  numClients: process.env.EMULATE ? parseInt(process.env.EMULATE) : 1,
  moduleURL: import.meta.url,
});
