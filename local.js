const localStorage = require("node-localstorage");
const { safeString, db } = require("./common/types");

/**
 * @returns {db}
 */
const create = () => {
  const local = new localStorage.LocalStorage("./scratch-db");
  /**
   * @type {db}
   */
  const current = {
    get: async (key) => {
      key = safeString(key);
      return local.getItem(key);
    },
    set: async (key, value) => {
      key = safeString(key);
      value = safeString(value);

      local.setItem(key, value);

      return value;
    },
    mget: async (keys) => {
      keys = keys.map(safeString);
      return keys.map((key) => local.getItem(key));
    },
    mset: async (keys, values) => {
      keys = keys.map(safeString);
      values = values.map(safeString);

      keys.forEach((key, i) => {
        local.setItem(key, values[i]);
      });

      return values;
    },
    delete: async (key) => {
      key = safeString(key);
      local.removeItem(key);
      return true;
    },
    mdelete: async (keys) => {
      keys.map(safeString).forEach((key) => {
        local.removeItem(key);
      });
      return true;
    },
    scan: async (cursor = null) => {
      let keys = [];
      if (!cursor) cursor = 0;
      for (let i = +cursor; i < Math.min(cursor + 50, local.length); i++) {
        keys.push(local.key(i));
      }
      return {
        keys,
        cursor: +cursor + 50,
      };
    },
  };
  return current;
};

module.exports.create_local = create;
