import { GluonElement, html } from 'gluonjs/gluon.js';

import * as blockies from '../lib/blockies.js';

class EthereumBlockie extends GluonElement {
  get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          overflow: hidden;
          border-radius: 50%;
          border: 1px solid #00000050;
        }
        ::slotted(canvas) {
          vertical-align: bottom;
        }
      </style>
      <slot></slot>
    `;
  }

  set address(address) {
    if (this.blockie) {
      this.removeChild(this.blockie);
    }
    this.blockie = blockies.create({ seed: address.toLowerCase(), size: 8, scale: this.size / 8 });
    this.appendChild(this.blockie);
  }

  // The height and width of this blockie in pixels
  get size() {
    return parseInt(this.getAttribute('size')) || 32;
  }

  set size(size) {
    this.setAttribute('size', size);
  }
}

customElements.define(EthereumBlockie.is, EthereumBlockie);
