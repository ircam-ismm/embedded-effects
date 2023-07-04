import { LitElement, html, css, nothing } from 'lit';

import '@ircam/simple-components/sc-signal.js';

class SwSignalViz extends LitElement {
  static properties = {
    state: { 
      type: 'any',
      default: null,
    },
  };

  static styles = css`
    :host {
      display: inline-block;
      width: 300px;
      height: 150px;
    }

    sc-signal {
      width: 100%;
      height: 100%;
    }
  `;

  get state() {
    return this._state;
  }

  set state(value) {
    if (this._unsubscribeState) {
      this._unsubscribeState();
    }

    this._state = value;

    if (this._state === null) {
      return;
    }

    this._unsubscribeState = this._state.onUpdate(updates => {
      if ('vizData' in updates) {
        const vizData = updates.vizData;
        const vizBlock = new Float32Array(2);
        vizBlock[0] = vizData.min;
        vizBlock[1] = vizData.max;
        this._$signal.value = {
          time: vizData.time,
          data: Array.from(vizBlock),
        }
      }
    });
  }

  constructor() {
    super();

    this._state = null;
    this._unsubscribeState = null;
    // this.vizObj = null;
  }

  firstUpdated() {
    super.firstUpdated();

    this._$signal = this.shadowRoot.querySelector('sc-signal');
  }

  render() {
    return html`
      <sc-signal></sc-signal>
    `;
  };
}


customElements.define('sw-signal-viz', SwSignalViz);