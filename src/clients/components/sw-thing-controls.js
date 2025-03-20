import { LitElement, html, css } from 'lit';

import './sw-signal-viz.js';
import '@ircam/sc-components/sc-slider.js';
import '@ircam/sc-components/sc-toggle.js';
import '@ircam/sc-components/sc-select.js';
import '@ircam/sc-components/sc-text.js';

class SwThingControls extends LitElement {
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
      width: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .slider sc-slider {
      height: 100%;
      width: 100%;
    }

    .slider sc-text {
      width: 100%;
      border: 1px solid #232323;
      border-radius: 0;
      text-align: center;
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

    this.thingState = null;
    this.scriptCollection = null;
  }

  render() {
    return html`
      <div class="infos">
        <sc-text>${this.thingState.get('id')}</sc-text>
        <sc-select
          .options="${this.scriptCollection.get('name')}"
          .value=${this.thingState.get('selectedScript')}
          placeholder="select script"
          @change=${e => {
            const selectedScript = e.target.value ? e.target.value : null;
            this.thingState.set({ selectedScript });
          }}
        ></sc-select>
      </div>
      <div class="slider">
        <sc-slider
          min=0
          max=10
          orientation="vertical"
          value=${this.thingState.get('inputGain')}
          @input=${e => this.thingState.set({ inputGain: e.detail.value })}
        ></sc-slider>
        <sc-text>In</sc-text>
      </div>
      <div class="slider">
        <sc-slider
          min=0
          max=10
          orientation="vertical"
          value=${this.thingState.get('outputGain')}
          @input=${e => this.thingState.set({ outputGain: e.detail.value })}
        ></sc-slider>
        <sc-text>Out</sc-text>
      </div>
      <div class="monitoring">
        <div class="select">
          <sc-text>monitoring</sc-text>
          <sc-toggle
            @change=${e => this.thingState.set({ monitoring: e.detail.value })}
          ></sc-toggle>
        </div>
        <div class="viz">
          ${this.thingState.get('monitoring')
            ? html`
                <div>
                  <sw-signal-viz
                    id="viz-dry"
                    stateParam="vizDataDry"
                    .state=${this.thingState}
                  ></sw-signal-viz>
                  <p>dry signal/input</p>
                </div>
                <div>
                  <sw-signal-viz
                    id="viz-wet"
                    stateParam="vizDataWet"
                    .state=${this.thingState}
                  ></sw-signal-viz>
                  <p>wet signal/output</p>
                <div>
              `
            : ''
          }
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribeThingStateUpdate = this.thingState.onUpdate(updates => {
      if ('vizDataWet' in updates || 'vizDataDry' in updates) {
        return;
      }

      this.requestUpdate();
    });

    this.unsubscribeScriptCollectionAttach = this.scriptCollection.onAttach(() => this.requestUpdate());
    this.unsubscribeScriptCollectionDetach = this.scriptCollection.onDetach(() => this.requestUpdate());
    this.unsubscribeScriptCollectionUpdate = this.scriptCollection.onUpdate(() => this.requestUpdate());
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.unsubscribeThingStateUpdate();

    this.unsubscribeScriptCollectionAttach();
    this.unsubscribeScriptCollectionDetach();
    this.unsubscribeScriptCollectionUpdate();
  }
}

customElements.define('sw-thing-controls', SwThingControls);
