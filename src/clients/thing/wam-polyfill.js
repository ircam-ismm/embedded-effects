import fs from 'node:fs';
import { URL } from 'node:url'
import webaudio from 'node-web-audio-api';

for (let name in webaudio) {
  globalThis[name] = webaudio[name];
}

globalThis.window = { URL };
globalThis.HTMLElement = class {};
globalThis.customElements = {
  define: function() {}
};
globalThis.fetch = (pathname) => {
  pathname = pathname.replace(/^file:\/\//, '');

  return new Promise(resolve => {
    if (!fs.existsSync(pathname)) {
      resolve({
        ok: false,
        msg: `file ${pathname} not found`,
      });
    } else {
      const buffer = fs.readFileSync(pathname);

      resolve({
        ok: true,
        text: () => buffer.toString(),
        json: () => JSON.parse(buffer.toString()),
        arrayBuffer: () => buffer,
      });
    }
  });
};
