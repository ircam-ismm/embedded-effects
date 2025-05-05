import '@soundworks/helpers/polyfills.js';
import { Server } from '@soundworks/core/server.js';
import { loadConfig, configureHttpRouter } from '@soundworks/helpers/server.js';

import '../utils/catch-unhandled-errors.js';

import PluginScriptingServer from '@soundworks/plugin-scripting/server.js';

import thingDefinition from './definitions/thing.js';

// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

const config = loadConfig(process.env.ENV, import.meta.url);

console.log(`
--------------------------------------------------------
- launching "${config.app.name}" in "${process.env.ENV || 'default'}" environment
- [pid: ${process.pid}]
--------------------------------------------------------
`);

const server = new Server(config);
configureHttpRouter(server);

server.stateManager.defineClass('thing', thingDefinition);

server.pluginManager.register('scripting', PluginScriptingServer, {
  dirname: 'scripts',
});

await server.start();

server.stateManager.registerUpdateHook('thing', async (updates, currentValues) => {
  if ('selectedScript' in updates && updates.selectedScript === null) {
    // let's just delete the script shared state class
    server.stateManager.deleteClass(`script:${currentValues.id}`);
  }

  if ('defineScriptSharedStateClass' in updates) {
    // delete and recreate the script shared state class corresponding to a given client
    const { className, classDescription } = updates.defineScriptSharedStateClass;

    if (server.stateManager.isClassDefined(className)) {
      // this will also destroy all associated states
      server.stateManager.deleteClass(className);
    }

    server.stateManager.defineClass(className, classDescription);
    // we create the state here, so that both thing and controller can attach to the
    // state without concurrency issues
    const _ = await server.stateManager.create(className);
    console.log(_.getValues());
  }
});
