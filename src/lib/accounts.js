import * as storage from './storage.js';

// Add an account with the given address. If account already exists, do nothing.
export const add = address => {
  const accounts = JSON.parse(storage.read('accounts')) || {};
  if (accounts[address]) {
    return; // Account already exists, do nothing
  }
  accounts[address] = {};
  storage.store('accounts', JSON.stringify(accounts));
};

// Remove an account with the specified address.
export const remove = address => {
  storage.removeSecure(`account_${address}_privkey`);
  const accounts = JSON.parse(storage.read('accounts')) || {};
  delete accounts[address];
  storage.store('accounts', JSON.stringify(accounts));
};

// Take ownership of an account by providing the private key
// This adds a flag to the account indicating it is owned,
// And stores the private key in secure storage
export const own = (address, privkey) => {
  add(address); // Add account if it did not already exist
  const accounts = JSON.parse(storage.read('accounts')) || {};
  if (accounts[address].owned) {
    return; // Account is already owned, do nothing
  }
  // TODO: Check if the privkey is correct for this address
  accounts[address].owned = true;
  storage.store('accounts', JSON.stringify(accounts));
  storage.storeSecure(`account_${address}_privkey`, privkey);
};

// Return array of registered accounts
export const list = () => {
  const accounts = JSON.parse(storage.read('accounts')) || {};
  return Object.keys(accounts).map(address => Object.assign({ address: address }, accounts[address]));
};

// Return a single account
export const get = address => {
  const accounts = JSON.parse(storage.read('accounts')) || {};
  return Object.assign({ address: address }, accounts[address]);
};
