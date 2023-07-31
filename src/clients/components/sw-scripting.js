import { LitElement, html, css } from 'lit';


import '@ircam/sc-components/sc-button.js';
import '@ircam/sc-components/sc-text.js';
import '@ircam/sc-components/sc-editor.js';
import '@ircam/sc-components/sc-filetree.js';


class SwScripting extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      height: 100%;
      width: 100%;
    }

    sc-filetree {
      width: 200px;
      height: 100%;
    }

    sc-editor {
      width: calc(100% - 200px);
      height: 100%
    }
  `;

  constructor() {
    super();

    this.pluginScripting = null;
    this._filesystem = null;

    this.currentScript = null;
  }

  render() {
    const filetree = this._filesystem.getTree();

    return html`
      <sc-filetree
        editable=true;
        .value=${filetree}
        @change=${this._updateFiletree}
        @input=${this._selectScript}
      ></sc-filetree>
      <sc-editor
        save-button=true
        .value="${(this.currentScript && this.currentScript.source || '')}"
        @change="${e => this.updateScript(e.detail.value)}"
      ><sc-editor>
    `
  }

  set pluginFilesystem(value) {
    this._filesystem = value;
    this._filesystem.onUpdate(() => this.requestUpdate());
  }

  _updateFiletree(e) {
    const value = e.detail.value;
    // this is not nice, to review
    const { path } = this._filesystem.getTree();
    const pathRe = new RegExp(`^${path}\/`);

    switch (value.command) {
      case 'writeFile':
        const defaultScript = `\
// export function process(audioContext, input, output) {
//   // your script here
//   // !! beware of feedback !!
//   input.connect(output);
// }`;
        this._filesystem.writeFile(value.pathname.replace(pathRe, ''), defaultScript);
        break;
      case 'rename':
        this._filesystem.rename(value.oldPathname.replace(pathRe, ''), value.newPathname.replace(pathRe, ''));
        break; 
      case 'mkdir':
        this._filesystem.mkdir(value.pathname.replace(pathRe, ''));
        break; 
      case 'rm':
        this._filesystem.rm(value.pathname.replace(pathRe, ''));
        break; 
    }
  }

  async _selectScript(e) {
    const value = e.detail.value;

    if (value && value.type === "file") {
      if (this.currentScript) {
        this.currentScript.detach();
      }
  
      this.currentScript = await this.pluginScripting.attach(value.name);
  
      this.currentScript.onUpdate(updates => {
        if (updates.error) {
          console.log(updates.error);
        } else {
          this.requestUpdate();
        }
      });
  
      this.currentScript.onDetach(() => {
        this.currentScript = null;
  
        this.requestUpdate();
      });
  
      this.requestUpdate();
    }
  }

  updateScript(value) {
    if (this.currentScript) {
      this.currentScript.update(value);
    }
  }
}


customElements.define('sw-scripting', SwScripting);
