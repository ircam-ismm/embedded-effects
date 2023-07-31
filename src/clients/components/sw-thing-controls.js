import { LitElement, html, css } from 'lit';

import './sw-signal-viz.js';
import '@ircam/sc-components/sc-slider.js';
import '@ircam/sc-components/sc-toggle.js';
import '@ircam/sc-components/sc-select.js';
import '@ircam/sc-components/sc-text.js';

class SwThingControls extends LitElement {
  static properties = {
    monitoring: {
      state: true,
    }
  }

  static styles = css`
    :host {
      display: flex;
      width: 100%;
      height: 200px;
      border-bottom: 1px #343434 solid;
      flex-direction: row;
      align-content: stretch;
    }

    .infos {
      box-sizing: border-box;
      height: 100%;
      padding: 5px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .infos h1 {
      margin: 0;
    }

    .slider {
      height: 100%;
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .slider sc-slider {
      height: 100%;
      width: 100%;
    }

    .slider sc-text {
      width: 100px;
      min-width: 100px;
      border: 1px solid #232323;
      border-radius: 0;
    }

    .monitoring {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    }

    .monitoring sc-text {
      background-color: #000000;
      border: none;
    }

    .monitoring .viz {
      display: flex;
      flex-direction: row;
      height: calc(100% - 30px);
    }

    .monitoring .viz sw-signal-viz {
      height: calc(100% - 30px);
    }
    .monitoring .viz p {
      width: 100%;
      height: 30px;
      line-height: 30px;
      margin: 0;
      text-indent: 6px;
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
      this._state.set({ monitoringActive: value });
    }

    this.requestUpdate();
  }


  render() {
    const selectedScript = this._state.get('selectedScript');

    const options = this.pluginScripting.getList();
    options.unshift('select script');

    return html`
      <div class="infos">
        <h1>thing id ${this._id}</h1>
        <sc-select
          options="${JSON.stringify(options)}"
          @change=${e => {
            const selectedScript = e.target.value === "select script" ? null : e.target.value;
            this._state.set({ selectedScript });
          }}
        ></sc-select>
      </div>
      <div class="slider">
        <sc-slider
          min=0
          max=10
          orientation="vertical"
          value=${this._inputGainValue}
          @input=${e => {
            if (this._state) this._state.set({ inputGain: e.detail.value });
          }}
        ></sc-slider>
        <sc-text>input gain</sc-text>
      </div>
      <div class="slider">
        <sc-slider
          min=0
          max=10
          orientation="vertical"
          value=${this._outputGainValue}
          @input=${e => {
            if (this._state) this._state.set({ outputGain: e.detail.value });
          }}
        ></sc-slider>
        <sc-text>output gain</sc-text>
      </div>
      <div class="monitoring">
        <div class="select">
          <sc-text>monitoring</sc-text>
          <sc-toggle
            @change="${e => this.monitoring = e.detail.value}"
          ></sc-toggle>
        </div>
        <div class="viz">
          ${this._monitoring
            ? html`
                <div>
                  <sw-signal-viz
                    id="viz-dry"
                    stateParam="vizDataDry"
                    .state=${this._state}
                  ></sw-signal-viz>
                  <p>dry signal/input</p>
                </div>
                <div>
                  <sw-signal-viz
                    id="viz-wet"
                    stateParam="vizDataWet"
                    .state=${this._state}
                  ></sw-signal-viz>
                  <p>wet signal/output</p>
                <div>
              `
            : ''
          }
        </div>
      </div>
    `
  }
}

customElements.define('sw-thing-controls', SwThingControls);
