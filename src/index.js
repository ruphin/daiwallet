import { GluonElement, html } from '../node_modules/gluonjs/gluon.js';
import { onRouteChange, currentPath, resolveURL } from '../node_modules/gluon-router/gluon-router.js';

window.modulesAssetPath = module => {
  return `/pages/${module}`;
};

// accounts.add('0x5B9880B7DAAC20Ae719B2c7D8D0228a435F2DA5f');
// accounts.add('0x5B9880B7DAAC20Ae719B2ca6c34d164135398226');
// accounts.add('0x2a65Aca4D5fC5B5C859090a6c34d164135398226');
// accounts.own('0x2a65Aca4D5fC5B5C859090a6c34d164135398226', 'supersecretprivkey');

class AppElement extends GluonElement {
  get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        #pages > * {
          min-height: 100vh;
        }
        #pages > *:not(.visible) {
          display: none;
        }
      </style>
      <slot id="loadingScreen"></slot>
      <div id="pages">
        <accounts-page route="accounts"></accounts-page>
        <account-page route="accounts/"></account-page>
        <login-page route="login">LOGIN</login-page>
        <add-account-page route="add">ADD</add-account-page>
      </div>
    `;
  }

  constructor() {
    super();

    this._routes = {};
    this.loggedIn = false;
  }

  connectedCallback() {
    super.connectedCallback();

    onRouteChange((path, query, hash) => {
      // Some browsers call `onRouteChange` before `ready`.
      // If this happens, `this._routes` is still empty.
      // In that case, simply defer the call to `_routeChanged`.
      // if (Object.keys(this._routes).length === 0) {
      //   setTimeout(() => { this._routeChanged(newRoute, oldRoute) }, 0);
      //   return;
      // }

      // Remove initial '/' in the route path
      const oldPath = this._oldPath;
      let newPath = path.slice(1);
      this._oldPath = newPath;

      // Hide the old page
      if (this._routes[oldPath]) {
        this._routes[oldPath].classList.remove('visible');
      }

      // // Redirect to login if we are not logged in
      // if (!this.loggedIn && newPath != 'login') {
      //   window.history.replaceState({}, null, '/login');
      //   window.dispatchEvent(new Event('location-changed'));
      //   return;
      // }

      // Match nested account urls '/accounts/*'
      if (newPath.startsWith('accounts/')) {
        newPath = 'accounts/';
        this._oldPath = newPath;
      }

      // Show the new page
      if (this._routes[newPath]) {
        this._routes[newPath].visit && this._routes[newPath].visit();
        this._routes[newPath].classList.add('visible');
      } else {
        console.log(this._routes, newPath);
        // Go back if the new page does not exist (and the old page does)
        if (this._routes[oldPath]) {
          console.warn('Requested page does not exist');
          window.history.back();
        }
        return;
      }

      // Lazy load any new pages we are visiting that haven't been loaded yet
      if (this._routes[newPath]) {
        const pageName = this._routes[newPath].tagName.toLowerCase().slice(0, -5);
        const newPage = `${(window.modulesAssetPath && window.modulesAssetPath(pageName)) || ''}/${pageName}.js`;
        import(newPage).then(
          e => {
            console.log('Loaded ' + newPage);

            // TODO: Only do this once
            this.querySelector('#loadingScreen').setAttribute('loaded', '');

            // TODO: Only do this once for each unique path
            this._routes[newPath].visit && this._routes[newPath].visit();
          },
          e => {
            console.log(e);
            console.warn('Cannot load ' + newPage);
            window.history.back();
          }
        );
      }
      // // Log out user
      // if (newPath === 'logout') {
      //   this.loginStatus = false;
      //   window.dispatchEvent(new Event('location-changed'));
      // }
    });

    Array.prototype.map.call(this.$.pages.children, page => {
      this._routes[page.getAttribute('route')] = page;
    });

    // TODO: This doesn't account for 'accounts/*' paths.
    // Need some more rigorous implementation of subroutes
    const current = currentPath().slice(1);
    if (!(current in this._routes)) {
      this._oldPath = 'accounts';
      window.history.replaceState({}, null, '/accounts');
    } else {
      this._oldPath = current;
    }

    window.dispatchEvent(new Event('location-changed'));
  }
}

customElements.define(AppElement.is, AppElement);
