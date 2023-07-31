import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import launcher from '@soundworks/helpers/launcher.js';

import createLayout from './layout.js';

import pluginScripting from '@soundworks/plugin-scripting/client.js';
import pluginPlatformInit from '@soundworks/plugin-platform-init/client.js'
import pluginFilesystem from '@soundworks/plugin-filesystem/client.js';

import '@ircam/sc-components/sc-filetree.js';
import '@ircam/sc-components/sc-editor.js';

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
  client.pluginManager.register('filesystem', pluginFilesystem, {});
  client.pluginManager.register('platform-init', pluginPlatformInit, { audioContext });

  launcher.register(client, {
    initScreensContainer: $container,
    reloadOnVisibilityChange: false,
  });

  await client.start();

  const scripting = await client.pluginManager.get('scripting');
  const filesystem = await client.pluginManager.get('filesystem');
  let selectedScript = null;

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

  

//   $layout.addComponent({
//     render() {
//       return html`
//       <div style="
//         display: flex;
//         flex-direction: ${window.innerWidth > 600 ? 'row' : 'column'};
//       ">
//         <div>
//           <sw-scripting
//             .pluginScripting="${scripting}";
//           ></sw-scripting>
//         </div>

//         <div style="
//           display: flex;
//           flex-direction: column;
//         ">
//           <div style="
//             display: flex;
//             flex-direction: row;
//             align-items: center;
//           ">
//             <h2 style="
//               margin: 10px 20px;
//             ">set global script</h2>
//             <select style="height: 30px" @change="${e => {
//               const selectedScript = e.target.value === "" ? null : e.target.value;
//               things.forEach(async state => {
//                 state.set({ selectedScript });
//               });
//             }}">
//               <option value="">none</option>
//               ${scripting.getList().map(scriptName => {
//                 return html`<option value=${scriptName}>${scriptName}</option>`
//               })}
//             </select>
//           </div>
//           <div style="
//             display: flex;
//             flex-direction: ${window.innerWidth > 1000 ? 'row' : 'column'};
//             align-items: flex-start;
            
//           ">
//             ${Array.from(things).map(state => {
//               return html`
//                 <sw-thing-controls
//                   .state=${state}
//                   .pluginScripting=${scripting}
//                 ></sw-thing-controls>
//               `
//             })}
//           </div>
//         </div>
        
//       </div>
//     `}
//   });
// }

  

//   $layout.addComponent({
//     render() {
//       const filetree = scripting.getTree();
//       console.log(filetree);
//       return html`
//         <div
//           style="
//             display: flex;
//             flex-direction: row;
//             height: 100vh;
//           "
//         >
//           <!-- filetree -->
//           <sc-filetree
//             style="
//               flex-basis: 20%;
//               height: 100%;
//             "
//              
//             .value=${filetree}
//             @change=${e => {
//               const {command, ...args} = e.detail.value;
//               console.log(command, args);
//               // console.log(...args);
//               scripting[command](...args);
//               this.requestUpdate();
//             }}
//           ></sc-filetree>
//           <sc-editor style="
//             flex-basis: 30%;
//             height: 100%;
//           "></sc-editor>
//           <div style="
//               flex-basis: 50%;
//               background-color: mediumpurple;
//             "
//           ></div>
//         </div>
//       `
//     }
//   });
// }

  $layout.addComponent({
    render() {
      const filetree = scripting.getTree();
      return html`
        <div
          style="
            display: flex;
            flex-direction: row;
            height: 100vh;
          "
        >
          <sw-scripting
            style="
              flex-basis: 40%;
            "
            .pluginScripting="${scripting}";
            .pluginFilesystem="${filesystem}"
          ></sw-scripting>
          <div style="
              flex-basis: 60%;
              overflow: scroll;
            "
          >
            ${Array.from(things).map(state => {
              return html`
                <sw-thing-controls
                  .state=${state}
                  .pluginScripting=${scripting}
                ></sw-thing-controls>
              `
            })}
          </div>
        </div>
      `
    }
  });
}

launcher.execute(main, {
  numClients: parseInt(new URLSearchParams(window.location.search).get('emulate')) || 1,
  width: '50%',
});
