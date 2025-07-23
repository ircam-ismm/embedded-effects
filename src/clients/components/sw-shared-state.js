import { html, css, LitElement } from 'lit';
import '@ircam/sc-components';
/**
 * Create a default interface for a soundworks shared state
 */
class SwSharedState extends LitElement {
  #unsubscribe = null;

  constructor() {
    super();

    this.sharedState = null;
  }

  render() {
    const parts = [];
    const description = this.sharedState.getDescription();

    for (let [name, desc] of Object.entries(description)) {
      let control = null;

      switch (desc.type) {
        case 'boolean': {
          control = html`
            <sc-toggle
              ?active=${this.sharedState.get(name)}
              @change=${e => this.sharedState.set(name, e.detail.value)}
            ></sc-toggle>
          `;
          break;
        }
        case 'int': {
          control = html`
            <sc-slider
              min=${desc.min}
              max=${desc.max}
              step="1"
              number-box
              value=${this.sharedState.get(name)}
              @input=${e => this.sharedState.set(name, e.detail.value)}
            ></sc-slider>
          `;
          break;
        }
        case 'float': {
          control = html`
            <sc-slider
              min=${desc.min}
              max=${desc.max}
              number-box
              value=${this.sharedState.get(name)}
              @input=${e => this.sharedState.set(name, e.detail.value)}
            ></sc-slider>
          `;
          break;
        }
        case 'string': {
          control = html`
            <sc-text editable>${name}</sc-text>
          `;
          break;
        }
        case 'enum': {
          control = html`
            <sc-select
              .options=${desc.list}
              value=${this.sharedState.get(name)}
              @change=${e => this.sharedState.set(name, e.detail.value)}
            ></sc-select>
          `;
          break;
        }
        case 'any': {
          control = html`
            <sc-editor
              value=${this.sharedState.get(name)}
              @change=${e => this.sharedState.set(name, e.detail.value)}
            ></sc-editor>
          `;
          break;
        }
      }

      const part = html`<div style="padding: 2px 0">
        <sc-text>${name}</sc-text>
        ${control}
      </div>`;

      parts.push(part);
    }

    console.log(parts);
    return parts;
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.sharedState) {
      throw new TypeError(`Cannot create 'sw-shared-state', attribute 'sharedState' has not been set`);
    }

    this.#unsubscribe = this.sharedState.onUpdate(() => this.requestUpdate(), true);
  }

  disconnectedCallback() {
    this.#unsubscribe();
    super.disconnectedCallback();
  }
}

if (customElements.get('sw-shared-state') === undefined) {
  customElements.define('sw-shared-state', SwSharedState);
}

export default SwSharedState;
