import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url'
import webaudio from 'node-web-audio-api';
import mime from 'mime';

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

    // create real Response object, so that WebAssembly.compileStreaming can work
    const extname = path.extname(pathname);
    const buffer = fs.readFileSync(pathname);

    const headers = new Headers();
    headers.append('Content-Type', mime.getType(extname));

    const res = new Response(buffer, { status: 200, headers });

    resolve(res);
  });
};
