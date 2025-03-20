import '@soundworks/helpers/polyfills.js';
import { Client } from '@soundworks/core/client.js';
import { loadConfig, launcher } from '@soundworks/helpers/browser.js';
import { html, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js'
import pluginScripting from '@soundworks/plugin-scripting/client.js';

import '@ircam/sc-components/sc-separator.js';
import '../components/sw-thing-controls.js';

// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

async function main($container) {
  /**
   * Load configuration from config files and create the soundworks client
   */
  const config = loadConfig();
  const client = new Client(config);

  launcher.register(client, {
    initScreensContainer: $container,
    reloadOnVisibilityChange: false,
  });

  client.pluginManager.register('scripting', pluginScripting);

  await client.start();

  const scripting = await client.pluginManager.get('scripting');
  const scriptCollection = await scripting.getCollection();


  const things = await client.stateManager.getCollection('thing');
  things.onAttach(() => renderApp());
  things.onUpdate(() => renderApp());
  things.onDetach(() => renderApp());

  function renderApp() {
    render(html`
      <div class="controller-layout">
        <header>
          <h1>${client.config.app.name} | ${client.role}</h1>
          <sw-audit .client="${client}"></sw-audit>
        </header>
        <section>
          <sw-editor
            style="width: 50%;"
            .plugin=${scripting}
          ></sw-editor>
          <sc-separator></sc-separator>
          <div style="width: 50%">
            ${repeat(things, state => state.get('id'), state => {
              return html`
                <sw-thing-controls
                  .thingState=${state}
                  .scriptCollection=${scriptCollection}
                ></sw-thing-controls>
              `;
            })}
          </div>
        </section>
      </div>
    `, $container);
  }

  renderApp();
}

launcher.execute(main, {
  numClients: parseInt(new URLSearchParams(window.location.search).get('emulate')) || 1,
  width: '50%',
});
