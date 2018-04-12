import { GluonElement, html } from '../../../node_modules/gluonjs/gluon.js';
import '../../components/mnemonicInput.js';

import * as accounts from '../../lib/accounts.js';

class AddAccountPage extends GluonElement {
  constructor() {
    super();
  }

  get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: none;
          background: #f3f3f3;
        }
        h1 {
          font-weight: normal;
          margin: 0;
          font-size: 20px;
        }
        .top {
          display: flex;
          height: 60px;
          justify-content: space-between;
          background: orange;
          color: white;
        }
        .menuTitle {
          display: flex;
          align-items: center;
        }
        .menuToggle {
          width: 60px;
          height: 60px;

        }
        .container {
          background: white;
          padding: 20px;
        }
      </style>
      <div class="top">
        <div class="menuTitle">
          <div class="menuToggle"></div>
          <h1>Add account</h1>
        </div>
      </div>
      <div class="container">
        <mnemonic-input id="mnemonicInput"></mnemonic-input>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.$.mnemonicInput.addEventListener('mnemonic', () => this.addAccount(this.$.mnemonicInput.mnemonic));
  }

  addAccount(mnemonic) {
    // THIS IS FOR DEMO PURPOSES ONLY
    mnemonicToSeed(mnemonic.join(''))
      .then(toHex)
      .then(addr => {
        const address = `0x${addr.slice(0, 40)}`;
        accounts.add(address);
        accounts.own(address, 'secretkey');
        window.history.back();
      });
  }

  visit() {
    this.$.mnemonicInput.mnemonic = [];
    this.$.mnemonicInput.render();
  }
}

customElements.define(AddAccountPage.is, AddAccountPage);

// TEMP IMPORT
const mnemonicToSeed = mnemonic => {
  const passphrase = fromUTF(mnemonic.normalize('NFKD'));
  const salt = fromUTF('mnemonic');
  return pbkdf2({ passphrase, salt, iterations: 2048, keyLength: 512, hash: 'SHA-512' });
};

const fromUTF = string => {
  // Encode JavaScript String as UTF-8 code points (http://ecmanaut.blogspot.nl/2006/07/encoding-decoding-utf8-in-javascript.html)
  const utf8CodePoints = unescape(encodeURIComponent(string));
  // Create a buffer from UTF-8 code points
  return new Uint8Array(Array.from(utf8CodePoints, char => char.charCodeAt(0))).buffer;
};

const toHex = buffer => {
  return Array.from(new Uint8Array(buffer), num => `0${num.toString(16)}`.slice(-2)).join('') || '0';
};

const pbkdf2 = ({ passphrase, salt, iterations, keyLength, hash }) =>
  subtle
    .importKey('raw', passphrase, { name: 'PBKDF2' }, false, ['deriveBits'])
    .then(key => subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash }, key, keyLength));

const subtle = window.crypto.subtle;
