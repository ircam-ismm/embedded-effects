import '@soundworks/helpers/polyfills.js';
import { Server } from '@soundworks/core/server.js';
import { loadConfig } from '@soundworks/helpers/node.js';

import '../utils/catch-unhandled-errors.js';

import pluginScripting from '@soundworks/plugin-scripting/server.js';

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
server.useDefaultApplicationTemplate();

server.stateManager.registerSchema('thing', thingDefinition);

server.pluginManager.register('scripting', pluginScripting, {
  dirname: 'scripts',
});

await server.start();
