import '@soundworks/helpers/polyfills.js';
import { Server } from '@soundworks/core/server.js';

import { loadConfig } from '../utils/load-config.js';
import '../utils/catch-unhandled-errors.js';

import pluginScripting from '@soundworks/plugin-scripting/server.js';
import pluginPlatformInit from '@soundworks/plugin-platform-init/server.js'

import thingSchema from './schemas/thing.js';
import controllerSchema from './schemas/controller.js'

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

/**
 * Create the soundworks server
 */
const server = new Server(config);
// configure the server for usage within this application template
server.useDefaultApplicationTemplate();

/**
 * Register plugins and schemas
 */
// server.pluginManager.register('my-plugin', plugin);
// server.stateManager.registerSchema('my-schema', definition);
server.pluginManager.register('platform-init', pluginPlatformInit);
server.pluginManager.register('scripting', pluginScripting, {
  dirname: 'src/clients/controller/scripts',
});

server.stateManager.registerSchema('controller', controllerSchema);
server.stateManager.registerSchema('thing', thingSchema);

/**
 * Launch application (init plugins, http server, etc.)
 */
await server.start();

// and do your own stuff!

