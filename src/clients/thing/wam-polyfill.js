import fs from 'node:fs';
import { URL } from 'node:url'
import webaudio from 'node-web-audio-api';

for (let name in webaudio) {
  globalThis[name] = webaudio[name];
}

// this can be simply fixed by calling `globalThis.URL` instead of window.URL
globalThis.window = {
  URL,
  setTimeout
};

globalThis.document = {
  querySelector: function() {}
};

globalThis.HTMLElement = class {};
globalThis.customElements = {
  define: function() {},
  get: function() {},
};

globalThis.fetch = (pathname) => {
  console.log('fetch:', pathname);
  pathname = pathname.replace(/^file:\/\//, '');

  return new Promise(resolve => {
    if (!fs.existsSync(pathname)) {
      throw new Error(`Cannot fetch file: ${pathname}, file does not exists`);
    }

    const buffer = fs.readFileSync(pathname);
    resolve({
      ok: true,
      text: () => buffer.toString(),
      json: () => JSON.parse(buffer.toString()),
      arrayBuffer: () => buffer,
    });
  });
};
