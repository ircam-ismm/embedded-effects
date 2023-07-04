import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import { loadConfig } from '../../utils/load-config.js';
import createLayout from './layout.js';

import pluginScripting from '@soundworks/plugin-scripting/client.js';

import { AudioContext, GainNode, mediaDevices, MediaStreamAudioSourceNode, AnalyserNode } from 'node-web-audio-api';

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
const analysisBuffer = new Float32Array(analysisBufferSize);

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

  const analyzer = new AnalyserNode(audioContext);


  streamSource.connect(analyzer);


  const synthScripting = await client.pluginManager.get('scripting');
  
  const thingState = await client.stateManager.create('thing');
  let controllerState;
  let input;
  let output;

  client.stateManager.observe(async (stateName, stateId) => {
    if (stateName === 'controller') {
      controllerState = await client.stateManager.attach(stateName, stateId);

      controllerState.onUpdate(async updates => {
        if ('selectedScript' in updates && updates.selectedScript !== null) {
          const script = await synthScripting.attach(updates.selectedScript);
          // console.log(script._state.getValues());

          script.onUpdate(async () => {
            const scriptImport = await script.import();
            const processFunc = scriptImport.process;

            if (input) {
              input.disconnect();
            }
            if (output) {
              output.disconnect();
            }

            input = new GainNode(audioContext);
            output = new GainNode(audioContext);
            streamSource.connect(input);
            output.connect(audioContext.destination);


            try {
              processFunc(audioContext, input, output);
            } catch (err) {
              console.log(err.message);
            }
          }, true);

          // const scriptImport = await script.import();
          // const processFunc = scriptImport.process;
          // processFunc(input, output);

        }
      }, true);
    }
  });

  const getVizData = () => {
    analyzer.getFloatTimeDomainData(analysisBuffer);
    const now = audioContext.currentTime;
    let min = 1;
    let max = -1;
    for (let j = 0; j < analysisBufferSize; j++) {
      const val = analysisBuffer[j];
      min = Math.min(min, val);
      max = Math.max(max, val);
    }
    thingState.set({
      vizData: {
        time: now,
        min,
        max
      }
    });
    const deltaT = analysisBufferSize / audioContext.sampleRate * 1000;
    setTimeout(getVizData, deltaT);
  }

  getVizData();
}


// The launcher allows to fork multiple clients in the same terminal window
// by defining the `EMULATE` env process variable
// e.g. `EMULATE=10 npm run watch-process thing` to run 10 clients side-by-side
launcher.execute(bootstrap, {
  numClients: process.env.EMULATE ? parseInt(process.env.EMULATE) : 1,
  moduleURL: import.meta.url,
});
