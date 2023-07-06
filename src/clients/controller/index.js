import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import createLayout from './layout.js';

import pluginScripting from '@soundworks/plugin-scripting/client.js';
import pluginPlatformInit from '@soundworks/plugin-platform-init/client.js'

import '@ircam/simple-components/sc-slider.js';

import '../components/sw-signal-viz.js'
import '../components/sw-scripting.js';
import '../components/sw-thing-controls.js';


import { html } from 'lit';
import thing from '../../server/schemas/thing.js';

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

  let things = new Set();
  let monitoredState;
  let inputGainValue = 1;


  client.stateManager.observe(async (stateName, stateId) => {
    if (stateName === 'thing') {
      const connectedThingState = await client.stateManager.attach(stateName, stateId);
      await connectedThingState.set({id: `${stateId}`});
      things.add(connectedThingState);

      connectedThingState.onDetach(() => {
        things.delete(connectedThingState);
        $layout.requestUpdate();
      });

      // const $visualizers = $layout.querySelectorAll('sw-signal-viz');
      // $visualizers.forEach($visualizer => $visualizer.state = connectedThingState);

      // inputGainValue = connectedThingState.get('inputGain');
      $layout.requestUpdate();
    }
  });

  const $layout = createLayout(client, $container);
  

  // ...
  // $layout.addComponent(html`<h1>ok</h1>`);

  // setTimeout(() => {
  //   console.log($layout.querySelector('h1'));
  // }, 100);

  $layout.addComponent({
    render() {
      return html`
      <div style="
        display: flex;
      ">
        <div>
          <sw-scripting
            .pluginScripting="${synthScripting}";
          ></sw-scripting>
        </div>

        <div style="
          display: flex;
          flex-direction: column;
        ">
          <div style="
            display: flex;
            flex-direction: row;
            align-items: center
          ">
            <h2 style="margin-right: 20px;">set global script</h2>
            <select style="height: 30px" @change="${e => {
              const selectedScript = e.target.value === "" ? null : e.target.value;
              things.forEach(async state => {
                state.set({ selectedScript });
              });
            }}">
              <option value="">none</option>
              ${synthScripting.getList().map(scriptName => {
                return html`<option value=${scriptName}>${scriptName}</option>`
              })}
            </select>
          </div>
          <div style="
            display: flex;
            flex-direction: row;
            align-items: flex-start;
          ">
            ${Array.from(things).map(state => {
              return html`
                <sw-thing-controls
                  .state=${state}
                  .pluginScripting=${synthScripting}
                ></sw-thing-controls>
              `
            })}
          </div>
        </div>
        
      </div>
    `}
  });
}

launcher.execute(main, {
  numClients: parseInt(new URLSearchParams(window.location.search).get('emulate')) || 1,
  width: '50%',
});
