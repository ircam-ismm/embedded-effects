import { LitElement, html, css } from 'lit';

import './sw-signal-viz.js';
import '@ircam/simple-components/sc-slider.js';
import '@ircam/simple-components/sc-toggle.js'

class SwThingControls extends LitElement {
  static properties = {
    monitoring: {
      state: true,
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin-right: 20px; 
      width: 322px;
      border: 1px #343434 solid;
      padding: 0 10px 10px;
    }
  `

  constructor() {
    super();

    this._id = null;
    this._state = null;
    this._inputGainValue = 1;
    this._monitoring = false;
    this.pluginScripting = null;


  }

  get state() {
    return this._state;
  }

  set state(value) {
    this._state = value;
    this._id = value.get('id');
    this._inputGainValue = value.get('inputGain');

    this._state.onUpdate(updates => {
      if ('selectedScript' in updates) {
        this.requestUpdate();
      }
    }, true);
  }

  get monitoring() {
    return this._monitoring;
  }

  set monitoring(value) {
    console.log('set monitoring');
    this._monitoring = value;

    if (this._state) {
      this._state.set({monitoringActive: value});
    }

    this.requestUpdate();
  }

  render() {
    const selectedScript = this._state.get('selectedScript');

    return html`
      <h2>thing id ${this._id}</h2>
      <div style="
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        margin: 5px 0;
      ">
        <h3>script</h3>
        <select @change="${e => {
          const selectedScript = e.target.value === "" ? null : e.target.value;
          this._state.set({selectedScript});
        }}">
          <option value="">none</option>
          ${this.pluginScripting.getList().map(scriptName => {
            if (selectedScript === scriptName) {
              return html`<option selected value=${scriptName}>${scriptName}</option>`
            } else {
              return html`<option value=${scriptName}>${scriptName}</option>`
            }
          })}
        </select>
      </div>
      <h3>input gain</h3>
      <sc-slider
        width="300"
        display-number
        min="0"
        max="10"
        value="${this._inputGainValue}"
        @input="${e => {
          if (this._state) this._state.set({inputGain: e.detail.value});
        }}"
      ></sc-slider>
      <div style="
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        margin: 5px 0;
      ">
        <h3>monitoring</h3>
        <sc-toggle
          @change="${e => this.monitoring = e.detail.value}"
        ></sc-toggle>
      </div>
      ${this._monitoring 
        ? html`<h3>dry signal/input</h3>
          <sw-signal-viz 
            id="viz-dry"
            stateParam="vizDataDry"
            .state=${this._state}
          ></sw-signal-viz>
          <h3>wet signal/output</h3>
          <sw-signal-viz 
            id="viz-wet"
            stateParam="vizDataWet"
            .state=${this._state}
          ></sw-signal-viz>` 
        : ''}
      
    `
  }
}

customElements.define('sw-thing-controls', SwThingControls);
