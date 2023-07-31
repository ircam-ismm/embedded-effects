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
    }

    sc-filetree {
      flex-basis: 33%;
      height: 100%;
    }

    sc-editor {
      flex-basis: 67%;
      height: 100%
    }
  `;

  constructor() {
    super();

    this.pluginScripting = null;
    this._pluginFilesystem = null;

    this.currentScript = null;
  }

  set pluginFilesystem(value) {
    this._pluginFilesystem = value;
    this._pluginFilesystem.onUpdate(() => {
      this.requestUpdate();
    })
  }

  changeFiletree(value) {
    const {command, ...args} = value;
    switch (command) {
      case 'writeFile':
        const defaultScript = `\
// export function process(audioContext, input, output) {
//   //your script here
//   // !! beware of feedback !!
//   input.connect(output);
// }`;
        this._pluginFilesystem.writeFile(args.pathname, defaultScript);
        break;
      case 'rename':
        this._pluginFilesystem.rename(args.oldPathname, args.newPathname);
        break; 
      case 'mkdir':
        this._pluginFilesystem.mkdir(args.pathname);
        break; 
      case 'rm':
        this._pluginFilesystem.rm(args.pathname);
        break; 
    }
  }

  async selectScript(value) {
    if (value && value.type === "file") {
      if (this.currentScript) {
        this.currentScript.detach();
      }
  
      this.currentScript = await this.pluginScripting.attach(value.name);
  
      this.currentScript.onUpdate(updates => {
        if (updates.error) {
          console.log(updates.error);
        }
        else {
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

  requestUpdate() {
    super.requestUpdate();
  }

  // render() {
  //   return html`
  //     <!-- scripting -->
  //     <div style="
  //       width: 500px;
  //       /*background-color: red;*/
  //       float: left;
  //     ">
  //       <h2>synth scripting</h2>

  //       <section style="margin: 8px 0">
  //         <sc-text
  //           value="create script (cmd + s):"
  //           readonly
  //         ></sc-text>
  //         <sc-text
  //           width="294"
  //           @change="${e => this.createSynthScript(e.detail.value)}"
  //         ></sc-text>
  //       </section>
  //       ${this.pluginScripting.getList().map((scriptName) => {
  //         return html`
  //           <section style="margin: 4px 0">
  //             <sc-button
  //               width="247"
  //               value="${scriptName}"
  //               text="select ${scriptName}"
  //               @input="${() => this.selectSynthScript(scriptName)}"
  //             ></sc-button>
  //             <sc-button
  //               width="247"
  //               value="${scriptName}"
  //               text="delete ${scriptName}"
  //               @input="${() => this.deleteSynthScript(scriptName)}"
  //             ></sc-button>
  //           </section>
  //         `;
  //       })}
  //       <sc-text
  //         readonly
  //         width="500"
  //         value="cmd+s to save. open the console to see possible syntax errors when editing"
  //       ></sc-text>
  //       <sc-editor
  //         style="display:block"
  //         width="500"
  //         height="500"
  //         .value="${(this.currentScript && this.currentScript.source || '')}"
  //         @change="${e => this.setSynthScriptValue(e.detail.value)}"
  //       ></sc-editor>
  //     </div
  //   `
  // }

  render() {
    const filetree = this._pluginFilesystem.getTree();
    console.log(filetree)
    
    return html`
      <sc-filetree
        editable=true;
        .value=${filetree}
        @change=${e => this.changeFiletree(e.detail.value)}
        @input=${e => this.selectScript(e.detail.value)}
      ></sc-filetree>
      <sc-editor
        save-button=true
        .value="${(this.currentScript && this.currentScript.source || '')}"
        @change="${e => this.updateScript(e.detail.value)}"
      ><sc-editor>
    `
  }
}


customElements.define('sw-scripting', SwScripting);