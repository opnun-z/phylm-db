/**
 * @typedef {Object} db
 * @property { (key : string) => Promise<string | null>} get Get item from db via key {key}
 * @property { (key: string, value: string) => Promise<string | null> } set Set item in db at key {key} with value {value}
 * @property { (keys : string[]) => Promise<(string | null)[] | null> } mget Get multiple keys from db via {keys}
 * @property { (keys : string[], values: string[]) => Promise<(string |null)[]> } mset Set multiple keys in db via {keys} {values}
 * @property { (key : string) => Promise<bool>} delete Delete key/value from db
 * @property { (keys : string[]) => Promise<bool>} mdelete Delete multiple keys from db
 * @property { (cursor : number | null) => Promise<{cursor: number, keys: string[]}} scan Scan db for all keys with pagination
 */

/**
 * @param {*} value
 * @returns {string}
 */
const safeString = (value) =>
  typeof value === "string" ? value : JSON.stringify(value);

/**
 * @type {db}
 */
let db;

module.exports = {
  safeString,
  db,
};
