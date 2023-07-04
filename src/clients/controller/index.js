import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import createLayout from './layout.js';

import pluginScripting from '@soundworks/plugin-scripting/client.js';
import pluginPlatformInit from '@soundworks/plugin-platform-init/client.js'

import '@ircam/simple-components/sc-signal.js';
import '@ircam/simple-components/sc-toggle.js';
import '@ircam/simple-components/sc-text.js';
import '@ircam/simple-components/sc-editor.js';

import '../components/sw-signal-viz.js'
import '../components/sw-scripting.js';

import { html } from 'lit';

// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

const config = window.SOUNDWORKS_CONFIG;
const audioContext = new AudioContext();

async function main($container) {
  const client = new Client(config);

  client.pluginManager.register('scripting', pluginScripting);
  client.pluginManager.register('platform-init', pluginPlatformInit, { audioContext });

  launcher.register(client, {
    initScreensContainer: $container,
    reloadOnVisibilityChange: false,
  });

  await client.start();

  const controllerState = await client.stateManager.create('controller');
  const synthScripting = await client.pluginManager.get('scripting');

  let connectedThingState;

  client.stateManager.observe(async (stateName, stateId) => {
    if (stateName === 'thing') {
      connectedThingState = await client.stateManager.attach(stateName, stateId);

      const $visualizer = $layout.querySelector('sw-signal-viz');
      $visualizer.state = connectedThingState; 
    }
  });

  const $layout = createLayout(client, $container);
  

  // ...
  // $layout.addComponent(html`<h1>ok</h1>`);

  // setTimeout(() => {
  //   console.log($layout.querySelector('h1'));
  // }, 100);

  $layout.addComponent(html`
    <sw-signal-viz></sw-signal-viz>
    <sw-scripting
      .pluginScripting="${synthScripting}";
      .controllerState="${controllerState}";
    ></sw-scripting
  `);
}

launcher.execute(main, {
  numClients: parseInt(new URLSearchParams(window.location.search).get('emulate')) || 1,
  width: '50%',
});
