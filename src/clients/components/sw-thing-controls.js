import { LitElement, html, css } from 'lit';

import './sw-signal-viz.js';
import '@ircam/sc-components/sc-slider.js';
import '@ircam/sc-components/sc-toggle.js';
import '@ircam/sc-components/sc-select.js';

class SwThingControls extends LitElement {
  static properties = {
    monitoring: {
      state: true,
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 200px;
      border: 1px #343434 solid;
      padding: 10px;
    }

    :host > div {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    h1 {
      margin-top: 0;
    }

    sc-slider {
      width: 30px;
      height: 80%;
    }

    sc-select {
      width: 100%;
    }

    sw-signal-viz {
      height: 80%;
    }

    .slider {
      flex-basis: 10%;
    }

    .signal-viz {
      flex-basis: 27%;
      padding: 0 5px;
    }

    #left-panel {
      flex-basis: 20%;
      margin: 0 20px 0 10px;
    }

    #monitoring-select {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      margin: 5px 0;
    }
  `

  constructor() {
    super();

    this._id = null;
    this._state = null;
    this._inputGainValue = 1;
    this._outputGainValue = 1;
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
    this._outputGainValue = value.get('outputGain');

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
      <h3>output gain</h3>
      <sc-slider
        width="300"
        display-number
        min="0"
        max="10"
        value="${this._outputGainValue}"
        @input="${e => {
          if (this._state) this._state.set({outputGain: e.detail.value});
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

  render() {
    const selectedScript = this._state.get('selectedScript');

    const options = this.pluginScripting.getList();
    options.unshift('select script');

    return html`
      <div id="left-panel">
        <h1>thing id ${this._id}</h1>
        <div id="monitoring-select">
          <h3>monitoring</h3>
          <sc-toggle
            @change="${e => this.monitoring = e.detail.value}"
          ></sc-toggle>
        </div>
        <div>
          <sc-select
            options="${JSON.stringify(options)}"
            @change=${e => {
              const selectedScript = e.target.value === "select script" ? null : e.target.value;
              this._state.set({ selectedScript });
            }}
          ></sc-select>
        </div>
      </div>
      <div class="slider">
        <sc-slider
          number-box
          min=0
          max=10
          orientation="vertical"
          value=${this._inputGainValue}
          @input=${e => {
            if (this._state) this._state.set({ inputGain: e.detail.value });
          }}
        ></sc-slider>
        <h3>input gain</h3>
      </div>
      <div class="slider">
        <sc-slider
          number-box
          min=0
          max=10
          orientation="vertical"
          value=${this._outputGainValue}
          @input=${e => {
            if (this._state) this._state.set({ outputGain: e.detail.value });
          }}
        ></sc-slider>
        <h3>output gain</h3>
      </div>
      ${this._monitoring
        ? html`
            <div class="signal-viz">
              <sw-signal-viz
                id="viz-dry"
                stateParam="vizDataDry"
                .state=${this._state}
              ></sw-signal-viz>
              <h3>dry signal/input</h3>
            </div>
            <div class="signal-viz">
              <sw-signal-viz
                id="viz-wet"
                stateParam="vizDataWet"
                .state=${this._state}
              ></sw-signal-viz>
              <h3>wet signal/output</h3>
            <div>
          `
        : ''
      }
    `
  }
}

customElements.define('sw-thing-controls', SwThingControls);
