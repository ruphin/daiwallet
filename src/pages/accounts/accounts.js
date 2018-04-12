import { GluonElement, html } from '../../../node_modules/gluonjs/gluon.js';
import { repeat } from '../../../node_modules/lit-html/lib/repeat.js';

import '../../components/blockie.js';
import '../../components/mnemonicInput.js';

import * as accounts from '../../lib/accounts.js';
import * as blockies from '../../lib/blockies.js';

class AccountsPage extends GluonElement {
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
          background-image: url('/pages/accounts/add.png');
          background-position: center center;
          background-repeat: no-repeat;
        }

        .accounts {
          padding: 12px 20px 0px;
          background: white;
        }
        .accounts:last-child {
          border-bottom: 1px solid lightgrey;
        }
        .accounts:last-child .account:last-child {
          border-bottom: none;
        }
        .accounts .title {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 16px;
        }
        .accounts .title .type {
          font-size: 15px;
          color: orange;
          font-weight: bold;
        }
        .accounts .title .currency {
          color: grey;
        }
        .account {
          display: flex;
          text-decoration: none;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid lightgrey;
          
        }
        .account .identifier {
          display: flex;
          align-items: center;
        }
        .account .identifier ethereum-blockie {
          margin-right: 20px;
        }
        .account .identifier .address {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
        }

        .account .identifier .address .name {
          font-weight: 400;
          color: #232323;
        }
        .account .identifier .address .hex {
          font-family: monospace;
          color: grey;
        }
        .account .value {
          color: #121212;
        }
      </style>
      <div class="top">
        <div class="menuTitle">
          <div class="menuToggle"></div>
          <h1>Accounts</h1>
        </div>
        <div class="shortcuts">
          <div class="refresh"></div>
          <a href="/add" class="add"></a>
        </div>
      </div>
      ${
        accounts.list().some(account => account.owned)
          ? html`
        <div class="accounts">
          <div class="title">
            <span class="type">Open accounts</span>
            <span class="currency">DAI</span>
          </div>
          ${repeat(
            accounts.list().filter(account => account.owned),
            account => account.address,
            account => html`
              <a class="account" href=${'/accounts/' + account.address}>
                <div class="identifier">
                  <ethereum-blockie address=${account.address}></ethereum-blockie>
                  <div class="address">
                    <span class="name">${account.name || 'Spending Wallet'}</span>
                    <span class="hex">${account.address.slice(0, 10)}</span>
                  </div>
                </div>
                <span class="value">${account.value || '1236.13'}</span>
              </a>
          `
          )}
        </div>
      `
          : ''
      }

      ${
        accounts.list().some(account => !account.owned)
          ? html`
        <div class="accounts">
          <div class="title">
            <span class="type">Locked accounts</span>
            <span class="currency">DAI</span>
          </div>
          ${repeat(
            accounts.list().filter(account => !account.owned),
            account => account.address,
            account => html`
              <a class="account" href=${'/accounts/' + account.address}>
                <div class="identifier">
                  <ethereum-blockie address=${account.address}></ethereum-blockie>
                  <div class="address">
                    <span class="name">${account.name || 'Spending Wallet'}</span>
                    <span class="hex">${account.address.slice(0, 10)}</span>
                  </div>
                </div>
                <span class="value">${account.value || '1236.13'}</span>
              </a>
          `
          )}
        </div>
      `
          : ''
      }
    `;
  }
  visit() {
    this.render();
  }
  _open(account) {
    window.history.replaceState({}, null, `/account/${account.address}`);
    window.dispatchEvent(new Event('location-changed'));
  }
}

customElements.define(AccountsPage.is, AccountsPage);
