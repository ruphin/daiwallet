import { GluonElement, html } from '../../../node_modules/gluonjs/gluon.js';
import { currentPath } from '../../../node_modules/gluon-router/gluon-router.js';

import '../../components/blockie.js';

import * as accounts from '../../lib/accounts.js';
import * as blockies from '../../lib/blockies.js';

class AccountPage extends GluonElement {
  constructor() {
    super();
    this.account = { address: '' };
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
        .shortcuts {
          display: flex;
        }
        .refresh, .add {
          width: 60px;
        }

        .top .shortcuts .add {
          background-image: url('/pages/accounts/add.png')
        }

        .accountHeader {
          background: orange;
          color: white;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .accountHeader .identifier {
          display: flex;
          align-items: center;
        }
        .accountHeader .identifier ethereum-blockie {
          margin-right: 14px;
        }
        .accountHeader .identifier .address {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
        }

        .accountHeader .identifier .address .hex {
          font-family: monospace;
        }

        .accountHeader .identifier .address .name {
          font-weight: 500;
        }

        .controls {
          background: orange;
          display: flex;
          justify-content: center;
          flex-wrap: nowrap;
          padding: 6px;
        }

        .controls button {
          color: orange;
          font-weight: 500;
          background: white;
          border: none;
          padding: 8px 0;
          border-radius: 5px;
          margin: 6px;
          width: 200px;
          font-family: "Roboto";
        }
      </style>
      <div class="top">
        <div class="menuTitle">
          <div class="menuToggle"></div>
          <h1>${this.account.owned ? 'Payment' : 'Observed'} account</h1>
        </div>
        <div class="shortcuts">
          <div class="refresh"></div>
        </div>
      </div>
      <div class="accountHeader">
        <div class="identifier">
          <ethereum-blockie address=${this.account.address}></ethereum-blockie>
          <div class="address">
            <span class="name">${this.account.name || 'Spending Wallet'}</span>
            <span class="hex">${this.account.address.slice(0, 10)}</span>
          </div>
        </div>
        <span class="value">${this.account.value || '1236.13'} DAI</span>
      </div>
      <div class="controls">
        ${this.account.owned ? html`<button>Transfer</button>` : html`<button>Unlock</button>`}
        <button>Receive</button>
      </div>
      <!-- <mnemonic-input></mnemonic-input> -->
    `;
  }

  visit() {
    this.account = accounts.get(currentPath().slice(10));
    this.render();
  }
}

customElements.define(AccountPage.is, AccountPage);
