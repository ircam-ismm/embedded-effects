import { LitElement, html, css } from 'lit';

import '@ircam/sc-components/sc-signal.js';

class SwSignalViz extends LitElement {
  static properties = {
    state: { 
      type: 'any',
      default: null,
    },
    stateParam: {
      type: 'string',
      default: null,
    }
  };

  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
      height: 100%;
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
    // console.log(value);
    if (this._unsubscribeState) {
      this._unsubscribeState();
    }

    this._state = value;

    if (this._state === null) {
      return;
    }

    this._unsubscribeState = this._state.onUpdate(updates => {
      if (this.stateParam in updates) {
        const vizData = updates[this.stateParam];
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
    // this.vizObj = null
  }

  firstUpdated() {
    super.firstUpdated();

    this._$signal = this.shadowRoot.querySelector('sc-signal');
  }

  render() {
    return html`
      <sc-signal
        duration=1
        min=-1
        max=1
        .colors="${['#800080', '#800080']}"
      ></sc-signal>
    `;
  };
}


customElements.define('sw-signal-viz', SwSignalViz);