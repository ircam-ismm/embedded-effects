import { LitElement, html, css } from 'lit';


import '@ircam/simple-components/sc-button.js';
import '@ircam/simple-components/sc-text.js';
import '@ircam/simple-components/sc-editor.js';


class SwScripting extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      margin: 0px 20px;
    }
  `;

  constructor() {
    super();

    this.pluginScripting = null;
    this.currentSynthScript = null;
  }

  async createSynthScript(scriptName) {
    if (scriptName !== '') {
      const defaultValue = `\
export function process(audioContext, input, output) {
  //your script here
  // !! beware of feedback !!
  input.connect(output);
}`;
      await this.pluginScripting.createScript(scriptName, defaultValue);

      this.selectSynthScript(scriptName);
    }
  }

  async selectSynthScript(scriptName) {
    if (this.currentSynthScript) {
      this.currentSynthScript.detach();
    }

    this.currentSynthScript = await this.pluginScripting.attach(scriptName);

    this.currentSynthScript.onUpdate(updates => {
      if (updates.error) {
        console.log(updates.error);
      }
      else {
        this.requestUpdate();
      }
    });

    this.currentSynthScript.onDetach(() => {
      this.currentSynthScript = null;

      this.requestUpdate();
    });

    this.requestUpdate();
  }

  async deleteSynthScript(scriptName) {
    await this.pluginScripting.deleteScript(scriptName);

    this.requestUpdate();
  }

  setSynthScriptValue(value) {
    if (this.currentSynthScript) {
      this.currentSynthScript.update(value);
    }
  }

  render() {
    return html`
      <!-- scripting -->
      <div style="
        width: 500px;
        /*background-color: red;*/
        float: left;
      ">
        <h2>synth scripting</h2>

        <section style="margin: 8px 0">
          <sc-text
            value="create script (cmd + s):"
            readonly
          ></sc-text>
          <sc-text
            width="294"
            @change="${e => this.createSynthScript(e.detail.value)}"
          ></sc-text>
        </section>
        ${this.pluginScripting.getList().map((scriptName) => {
          return html`
            <section style="margin: 4px 0">
              <sc-button
                width="247"
                value="${scriptName}"
                text="select ${scriptName}"
                @input="${() => this.selectSynthScript(scriptName)}"
              ></sc-button>
              <sc-button
                width="247"
                value="${scriptName}"
                text="delete ${scriptName}"
                @input="${() => this.deleteSynthScript(scriptName)}"
              ></sc-button>
            </section>
          `;
        })}
        <sc-text
          readonly
          width="500"
          value="cmd+s to save. open the console to see possible syntax errors when editing"
        ></sc-text>
        <sc-editor
          style="display:block"
          width="500"
          height="500"
          .value="${(this.currentSynthScript && this.currentSynthScript.source || '')}"
          @change="${e => this.setSynthScriptValue(e.detail.value)}"
        ></sc-editor>
      </div
    `
  }
}


customElements.define('sw-scripting', SwScripting);